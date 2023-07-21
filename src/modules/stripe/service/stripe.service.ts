import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GeneratorHelper } from '../../../shared/helpers/generator.helper';
import { PrismaService } from '../../../shared/services/prisma.service';
import { UserRegisterDto } from '../../auth/dto/user-register.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { User } from '@prisma/client';
import { UserService } from '../../user/user.service';
import { RESPONSE_MESSAGE } from '../../../constants/response-message';
import { StripeEvents } from '../../../constants/stripe-events';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { Cron, CronExpression } from '@nestjs/schedule';
import { JobType } from '../../../constants/job-type';
import { PortalSession } from '../../../interfaces/portal-session';
import { CreateStripeCheckoutSessionPayload } from '../payload/create-stripe-checkout-session.payload';
import { StripeData } from '../../../constants/stripe-data';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private generatorHelper: GeneratorHelper,
    private prismaService: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    @InjectQueue(JobType.STRIPE_JOBS) private readonly stripeQueue: Queue
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15', // https://stripe.com/docs/upgrades#api-changelog
    });
  }

  async plans() {
    const products = await this.stripe.products.list({
      active: true,
      limit: 100,
    });
    const prices = await this.stripe.prices.list({ active: true, limit: 1000 });
    const arrProducts = [];
    products.data.forEach((product) => {
      prices.data.forEach((price) => {
        if (product.default_price === price.id) {
          arrProducts.push({
            ...product,
            priceId: price.id,
            price_type: price.type,
            price_unit_amount: price.unit_amount,
            price_unit_amount_decimal: price.unit_amount_decimal,
            price_usage_type: price.recurring
              ? price.recurring.usage_type
              : null,
          });
        }
      });
    });
    return arrProducts;
  }

  async createStripeCustomerId(user: User): Promise<string> {
    if (typeof user.customerId === 'undefined' || !user.customerId) {
      const name =
        (user.firstName ? user.firstName : '') +
        '' +
        (user.lastName ? user.lastName : '');
      const email = user.email;
      const customer = await this.createCustomerId(name, email);
      if (typeof customer.id !== 'undefined' && customer.id) {
        user = await this.updateUser(
          { customerId: customer.id },
          BigInt(user.id)
        );
      }
    }
    return user.customerId;
  }

  async updateUser(data: object, userId: bigint): Promise<User> {
    const user = await this.prismaService.user.update({
      data: data,
      where: {
        id: BigInt(userId),
      },
    });
    return user;
  }

  async createCheckoutSession(
    user: User,
    createStripeCheckoutSessionPayload: CreateStripeCheckoutSessionPayload
  ) {
    await this.createStripeCustomerId(user);

    // Document: https://stripe.com/docs/billing/subscriptions/build-subscriptions
    // Check PriceId exits
    const price = await this.retrievePriceId(
      createStripeCheckoutSessionPayload.priceId
    );
    if (typeof price.id === 'undefined' || !price.id) {
      throw new BadRequestException(RESPONSE_MESSAGE.stripePrice.notFound);
    }

    // Check
    let line_items = [];
    if (
      price.recurring &&
      typeof price.recurring?.usage_type !== 'undefined' &&
      StripeData.PRICE_USAGE_TYPE.includes(price.recurring.usage_type)
    ) {
      line_items = [
        {
          price: createStripeCheckoutSessionPayload.priceId,
        },
      ];
    } else {
      line_items = [
        {
          price: createStripeCheckoutSessionPayload.priceId,
          quantity: 1,
        },
      ];
    }

    const checkoutSession = await this.stripe.checkout.sessions.create({
      mode: price.type == StripeData.PRICE_TYPE[0] ? 'subscription' : 'payment',
      customer: user.customerId,
      line_items: line_items,
      success_url: `${this.configService.get(
        'STRIPE_URL_SUCCESS_CHECKOUT'
      )}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('STRIPE_URL_CANCEL_CHECKOUT')}`,
    });

    return checkoutSession;
  }

  async createCustomerId(name: string, email: string) {
    return await this.stripe.customers.create({
      name,
      email,
    });
  }

  async retrieveSubscriptionId(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async retrievePriceId(priceId: string) {
    return await this.stripe.prices.retrieve(priceId);
  }

  async updateSubscriptionItemId(
    subscriptionItemId: string,
    used_quantity: number
  ) {
    const timestamp = parseInt(String(Date.now() / 1000));
    return await this.stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      { quantity: used_quantity, timestamp: timestamp, action: 'set' }
    );
  }

  async registerFreePlan(customerId: string) {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: this.configService.get('STRIPE_FREE_PLAN') }],
    });
  }

  async createPortalSession(user: User): Promise<PortalSession> {
    await this.createStripeCustomerId(user);
    return await this.createCustomerPortalSession(user);
  }

  async createCustomerPortalSession(user: User): Promise<PortalSession> {
    try {
      // Create customer portal link
      const portalLink = await this.stripe.billingPortal.sessions.create({
        customer: user.customerId,
        return_url: this.configService.get('STRIPE_CALL_BACK'),
      });

      if (typeof portalLink.id === 'undefined' || !portalLink.id) {
        throw new BadRequestException(
          RESPONSE_MESSAGE.stripe.createBillingPortalFail
        );
      }

      return portalLink;
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async webhookJob(body: any, header: any) {
    // Check header Stripe
    // if (
    //   typeof header['stripe-signature'] === 'undefined' ||
    //   !header['stripe-signature']
    // ) {
    //   throw new BadRequestException(RESPONSE_MESSAGE.webhook.failSignature);
    // }
    // try {
    //   console.log(header['stripe-signature']);
    //   const event = await this.stripe.webhooks.constructEvent(
    //     body,
    //     header['stripe-signature'],
    //     this.configService.get('STRIPE_WEBHOOK_END_POINT')
    //   );
    //   console.log(event);
    // } catch (err) {
    //   console.log(err.message);
    //   throw new BadRequestException(RESPONSE_MESSAGE.webhook.failSignature);
    // }

    await this.stripeQueue.add(
      JobType.CREATE_STRIPE_WEBHOOK_JOB,
      {
        body: body,
      },
      { removeOnComplete: true }
    );
    return true;
  }

  async stripeData(body: any, is_webhook: boolean) {
    try {
      if (
        typeof body?.data?.object?.customer === 'undefined' ||
        typeof body?.type === 'undefined'
      ) {
        throw new ForbiddenException(RESPONSE_MESSAGE.stripe.notFound);
      }

      const stripeId = body?.id;
      const customerId = body?.data?.object?.customer;
      const type = body?.type;
      const status = body?.data?.object?.status;
      const email = body?.data?.object?.billing_details?.email;
      const name = body?.data?.object?.billing_details?.name;
      let isActiveUser = false;

      // Check exits customerId
      let user;
      if (customerId) {
        user = await this.prismaService.user.findFirst({
          where: { customerId: customerId },
        });
        if (user || typeof user?.id !== 'undefined') {
          isActiveUser = true;
        }
      }

      // Check Email exits
      let newCustomerId;
      let flagReject = false;
      if (!user || typeof user.id === 'undefined' || !user.id) {
        user = await this.prismaService.user.findFirst({
          where: { email: email },
        });
        if (user && typeof user.id !== 'undefined' && user.id) {
          if (!user.customerId) {
            if (customerId) {
              newCustomerId = customerId;
              await this.updateUser({ customerId: customerId }, user.id);
            } else {
              newCustomerId = await this.createStripeCustomerId(user);
            }
          } else {
            flagReject = true;
          }
        } else {
          // Register account
          const arrAccount = {
            email: email,
            password: 'Welcome@2023',
          };
          if (!customerId) {
            const customer = await this.createCustomerId(name, email);
            newCustomerId = customer?.id;
          } else {
            newCustomerId = customerId;
          }
          await this.userService.create(arrAccount, newCustomerId);
          user = await this.prismaService.user.findFirst({
            where: { customerId: newCustomerId },
          });
        }
      }

      // Check exits stripeId
      const stripeLogExits = await this.prismaService.stripeLog.findFirst({
        where: { stripeId: stripeId },
      });
      if (stripeLogExits || typeof stripeLogExits?.id !== 'undefined') {
        await this.updatePaymentId(
          body,
          customerId,
          user,
          flagReject,
          newCustomerId
        );
        this.generatorHelper.logScreenData('stripeId is exits');
        return true;
      }

      return await this.prismaService.$transaction(async (tx) => {
        // save log
        const stripeLog = await tx.stripeLog.create({
          data: {
            id: this.generatorHelper.generateSnowflakeId(),
            stripeId: stripeId,
            customerId: customerId,
            event: type,
            json: JSON.stringify(body),
            isActiveUser: isActiveUser,
          },
        });
        if (isActiveUser && stripeLog && typeof stripeLog?.id !== 'undefined') {
          const stripeHistory = await tx.stripeHistory.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              stripeId: stripeId,
              stripeLogId: BigInt(stripeLog.id),
              creatorId: BigInt(user.id),
              customerId: customerId,
              event: type,
            },
          });

          if (is_webhook) {
            if (
              StripeEvents.EVENT_CHECK.SUBSCRIPTION.RUNNING.EVENT.includes(type)
            ) {
              let subscriptionStatus = StripeData.STATUS.DE_ACTIVE;
              const subscriptionId = body?.data?.object?.id;
              const subscriptionCreated = body?.data?.object?.start_date;

              // Check status
              if (
                StripeEvents.EVENT_CHECK.SUBSCRIPTION.RUNNING.STATUS.includes(
                  status
                )
              ) {
                subscriptionStatus = StripeData.STATUS.ACTIVE;
              }

              // Update subscriptionId
              if (subscriptionId.indexOf('sub_') >= 0) {
                if (
                  flagReject &&
                  user.subscriptionStatus === StripeData.STATUS.ACTIVE &&
                  user.subscriptionStatus
                ) {
                  await this.stripe.subscriptions.update(subscriptionId, {
                    metadata: { reject: '1' },
                  });
                } else {
                  await this.prismaService.user.update({
                    data: {
                      subscriptionId: subscriptionId,
                      subscriptionStatus: subscriptionStatus,
                      subscriptionCreated: subscriptionCreated,
                    },
                    where: {
                      id: BigInt(user.id),
                    },
                  });
                }
              }
            } else if (
              StripeEvents.EVENT_CHECK.CHARGE.RUNNING.EVENT.includes(type) ||
              StripeEvents.EVENT_CHECK.PAYMENT_INTENT.RUNNING.EVENT.includes(
                type
              )
            ) {
              let chargeStatus = StripeData.STATUS.DE_ACTIVE;
              let chargeId = '';
              let chargeCreated = '';

              // Check status
              if (
                StripeEvents.EVENT_CHECK.CHARGE.RUNNING.STATUS.includes(status)
              ) {
                chargeStatus = StripeData.STATUS.ACTIVE;
              }

              if (
                StripeEvents.EVENT_CHECK.PAYMENT_INTENT.RUNNING.EVENT.includes(
                  type
                )
              ) {
                chargeId = body?.data?.object?.latest_charge;
                chargeCreated = body?.data?.object?.created;
              } else {
                chargeId = body?.data?.object?.id;
                chargeCreated = body?.data?.object?.created;
              }

              // Update chargeId
              if (chargeId.indexOf('ch_') >= 0) {
                if (
                  flagReject &&
                  user.chargeStatus === StripeData.STATUS.ACTIVE &&
                  user.chargeStatus
                ) {
                  await this.stripe.charges.update(chargeId, {
                    metadata: { reject: '1' },
                  });
                } else {
                  await this.prismaService.user.update({
                    data: {
                      chargeId: chargeId,
                      chargeStatus: chargeStatus,
                      chargeCreated: parseInt(chargeCreated),
                      chargeUsed: 0,
                    },
                    where: {
                      id: BigInt(user.id),
                    },
                  });
                }
              }
            }
          } else {
            await this.updatePaymentId(
              body,
              customerId,
              user,
              flagReject,
              newCustomerId
            );
          }

          if (!stripeHistory || typeof stripeHistory.id === 'undefined') {
            this.generatorHelper.logScreenData('is Saved: stripeLog');
          } else {
            this.generatorHelper.logScreenData(
              'is Saved: stripeLog, stripeHistory'
            );
          }
        } else {
          this.generatorHelper.logScreenData('is Saved: stripeLog');
        }
      });
    } catch (e) {
      this.generatorHelper.logScreenData(e.message);
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async updatePaymentId(
    body: any,
    customerId: string,
    user: User,
    flagReject: boolean,
    newCustomerId: string
  ) {
    const type = body?.type;
    const status = body?.data?.object?.status;
    const created = body?.created;

    if (StripeEvents.EVENT_CHECK.SUBSCRIPTION.RUNNING.EVENT.includes(type)) {
      if (created >= user.subscriptionCreated || !user.subscriptionCreated) {
        let subscriptionStatus = StripeData.STATUS.DE_ACTIVE;
        const subscriptionId = body?.data?.object?.id;

        // Check status
        if (
          StripeEvents.EVENT_CHECK.SUBSCRIPTION.RUNNING.STATUS.includes(status)
        ) {
          subscriptionStatus = StripeData.STATUS.ACTIVE;
        }

        // Update subscriptionId
        if (subscriptionId.indexOf('sub_') >= 0) {
          if (
            flagReject &&
            user.subscriptionStatus === StripeData.STATUS.ACTIVE &&
            user.subscriptionStatus
          ) {
            await this.stripe.subscriptions.update(subscriptionId, {
              metadata: { reject: '1' },
            });
          } else {
            await this.prismaService.user.update({
              data: {
                subscriptionId: subscriptionId,
                subscriptionStatus: subscriptionStatus,
                subscriptionCreated: created,
              },
              where: {
                id: BigInt(user.id),
              },
            });
          }
        }
      }
    } else if (
      StripeEvents.EVENT_CHECK.CHARGE.RUNNING.EVENT.includes(type) ||
      StripeEvents.EVENT_CHECK.PAYMENT_INTENT.RUNNING.EVENT.includes(type)
    ) {
      if (created > user.chargeCreated || !user.chargeCreated) {
        let chargeStatus = StripeData.STATUS.DE_ACTIVE;
        let chargeId = '';

        // Check status
        if (StripeEvents.EVENT_CHECK.CHARGE.RUNNING.STATUS.includes(status)) {
          chargeStatus = StripeData.STATUS.ACTIVE;
        }

        if (
          StripeEvents.EVENT_CHECK.PAYMENT_INTENT.RUNNING.EVENT.includes(type)
        ) {
          chargeId = body?.data?.object?.latest_charge;
        } else {
          chargeId = body?.data?.object?.id;
        }

        // Update chargeId
        if (chargeId.indexOf('ch_') >= 0) {
          if (
            flagReject &&
            user.chargeStatus === StripeData.STATUS.ACTIVE &&
            user.chargeStatus
          ) {
            await this.stripe.charges.update(chargeId, {
              metadata: { reject: '1' },
            });
          } else {
            await this.prismaService.user.update({
              data: {
                chargeId: chargeId,
                chargeStatus: chargeStatus,
                chargeCreated: parseInt(created),
                chargeUsed: StripeEvents.EVENT_CHECK.CHARGE.EVENT_USED.includes(
                  type
                )
                  ? 0
                  : user.chargeUsed,
              },
              where: {
                id: BigInt(user.id),
              },
            });
          }
        }
      }
    }
  }

  async registerAccountFromWebHookStripe(email: string): Promise<boolean> {
    return true;
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async cronJobFetchingData() {
    const eventLogs = await this.stripe.events.list({
      // delivery_success: false,
      limit: 1000,
    });

    await this.stripeQueue.add(
      JobType.CREATE_STRIPE_EVENT_HISTORY_JOB,
      {
        eventLogs: eventLogs,
      },
      { removeOnComplete: true }
    );

    return true;
  }

  async jobEventFetchingData(eventLogs: any) {
    eventLogs.data.forEach((eventLog) => {
      this.eventFetchingDataJob(eventLog);
    });
  }

  async eventFetchingDataJob(body: any) {
    await this.stripeQueue.add(
      JobType.CREATE_STRIPE_EVENT_FETCHING_DATA_JOB,
      {
        body: body,
      },
      { removeOnComplete: true }
    );
    return true;
  }
}
