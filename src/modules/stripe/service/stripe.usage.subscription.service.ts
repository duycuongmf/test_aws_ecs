import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  User,
  Prisma,
  ProductFormat,
  HarvestDeliveryMethod,
  HarvestDeliveryMethodRef,
  TypeFarmHarvest,
  TypeWildHarvest,
  HarvestWeightUnit,
  ContactType,
} from '@prisma/client';

import { GeneratorHelper } from '../../../shared/helpers/generator.helper';
import { PrismaService } from '../../../shared/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { JobType } from '../../../constants/job-type';
import { Queue } from 'bull';
import { UsedType } from '../../../constants/used-type';
import { transformQueryDate } from '../../../helpers/util.helper';
import { StripeService } from './stripe.service';
import { RESPONSE_MESSAGE } from '../../../constants/response-message';
import { StripeData } from '../../../constants/stripe-data';

@Injectable()
export class StripeUsageSubscriptionService {
  constructor(
    private generatorHelper: GeneratorHelper,
    private prismaService: PrismaService,
    private configService: ConfigService,
    private stripeService: StripeService,
    @InjectQueue(JobType.USED_SERVICES_JOBS) private readonly usedQueue: Queue
  ) {}

  async checkPaymentStripe(user: User): Promise<any> {
    let userId = user.id;
    let chargeStatus = user.chargeStatus;
    let subscriptionStatus = user.subscriptionStatus;

    // Check organization user
    if (
      (chargeStatus === StripeData.STATUS.DE_ACTIVE || !chargeStatus) &&
      (subscriptionStatus === StripeData.STATUS.DE_ACTIVE ||
        !subscriptionStatus)
    ) {
      const userGrants = await this.prismaService.grant.findMany({
        where: {
          userId: BigInt(user.id),
          organizationId: { not: user.organizationId },
        },
      });
      const organizationIds = userGrants.map((row) => row.organizationId);
      const ownerOrganizations = await this.prismaService.grant.findMany({
        where: {
          organizationId: { in: organizationIds },
          isDefault: true,
        },
      });

      const creatorIds = ownerOrganizations.map((row) => row.creatorId);
      const ownerActive = await this.prismaService.user.findFirst({
        where: {
          id: { in: creatorIds },
          OR: [
            {
              chargeStatus: StripeData.STATUS.ACTIVE,
              chargeUsed: 0,
            },
            {
              subscriptionStatus: StripeData.STATUS.ACTIVE,
            },
          ],
        },
      });

      if (typeof ownerActive.id !== 'undefined' && ownerActive.id) {
        userId = ownerActive.id;
        chargeStatus = ownerActive.chargeStatus;
        subscriptionStatus = ownerActive.subscriptionStatus;
      }
    }

    if (
      (!chargeStatus || chargeStatus === StripeData.STATUS.DE_ACTIVE) &&
      (!subscriptionStatus ||
        subscriptionStatus === StripeData.STATUS.DE_ACTIVE)
    )
      return {};

    if (chargeStatus === StripeData.STATUS.ACTIVE) {
      return { type: StripeData.CHARGE, userId: userId };
    } else if (subscriptionStatus === StripeData.STATUS.ACTIVE) {
      return { type: StripeData.SUBSCRIPTION, userId: userId };
    }
    return {};
  }

  async saveStripeUsageSubscriptionQueue(
    userId: bigint,
    serviceId: bigint,
    module: string,
    action: string
  ) {
    await this.usedQueue.add(JobType.CREATE_USED_SERVICES_JOB, {
      userId: userId,
      serviceId: serviceId,
      module: module,
      action: action,
    });
    this.generatorHelper.logScreenData(`${UsedType.HARVEST} added queue`);
    return true;
  }

  async createStripeUsageSubscriptionService(body: any) {
    try {
      // check payment stripe
      const user = await this.prismaService.user.findFirst({
        where: { id: BigInt(body?.userId) },
      });

      const paymentStripe = await this.checkPaymentStripe(user);
      if (typeof paymentStripe?.type !== 'undefined' || paymentStripe?.type) {
        if (paymentStripe?.type == StripeData.CHARGE) {
          await this.prismaService.user.update({
            data: {
              chargeStatus: StripeData.STATUS.DE_ACTIVE,
              chargeUsed: 1,
            },
            where: {
              id: BigInt(paymentStripe?.userId),
            },
          });
          this.generatorHelper.logScreenData(
            `${UsedType.HARVEST} saved usage charge times`
          );
        } else if (paymentStripe?.type === StripeData.SUBSCRIPTION) {
          await this.prismaService.stripeUsageSubscription.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              quantity: 1,
              module: body?.module,
              action: body?.action,
              serviceUsedId: body?.serviceId,
              creatorId: BigInt(body?.userId),
            },
          });
          await this.updateTotalStripeUsageSubscription(paymentStripe?.userId);
        }
        this.generatorHelper.logScreenData(
          `${UsedType.HARVEST} saved usage times`
        );
      } else {
        this.generatorHelper.logScreenData(`${UsedType.HARVEST} expired`);
      }
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async updateTotalStripeUsageSubscription(userId: bigint) {
    try {
      // Check exits user
      const user = await this.prismaService.user.findFirst({
        where: { id: BigInt(userId) },
      });

      if (typeof user.id === 'undefined' || !user.id) {
        throw new BadRequestException(RESPONSE_MESSAGE.users.notFound);
      }

      // Update stripe subscriptionItems
      const subscription = await this.stripeService.retrieveSubscriptionId(
        user.subscriptionId
      );

      if (
        typeof subscription.id === 'undefined' ||
        !subscription.id ||
        !subscription.items?.data[0]?.id ||
        !subscription.items?.data[0]?.plan?.id
      ) {
        throw new BadRequestException(RESPONSE_MESSAGE.subscription.notFound);
      }

      const subscriptionItemId = subscription.items.data[0].id;

      // Update quantity subscriptionItem
      const subscriptionItem =
        await this.stripeService.updateSubscriptionItemId(
          subscriptionItemId,
          1
        );

      this.generatorHelper.logScreenData(
        'calTotalUsedServices: ' + subscriptionItem?.id
      );
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }
}
