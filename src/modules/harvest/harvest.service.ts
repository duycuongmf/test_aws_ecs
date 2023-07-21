import {
  BadRequestException,
  ForbiddenException,
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
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { HarvestPrismaRepository } from './harvest.prisma.repository';
import { CreateHarvestPayload } from './payload/create-harvest.payload';
import { RESPONSE_MESSAGE } from '../../constants/response-message';
import { DeleteHarvestPayload } from './payload/delete-harvest.payload';
import { UpdateHarvestPayload } from './payload/update-harvest.payload';
import { SearchHarvestPayload } from './payload/search-harvest.payload';
import { GetAllHarvestPayload } from './payload/get-all-harvest.payload';
import { PrismaService } from '../../shared/services/prisma.service';
import * as moment from 'moment';
import { isUndefined } from 'lodash';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { PERMISSIONS } from '../auth/casl/action.enum';
import { subject } from '@casl/ability';
import { AuthAbilityFactory } from '../auth/casl/auth.ability.factory';
import { StripeUsageSubscriptionService } from '../stripe/service/stripe.usage.subscription.service';
import { UsedType } from '../../constants/used-type';

@Injectable()
export class HarvestService {
  constructor(
    private generatorHelper: GeneratorHelper,
    @Inject('HarvestRepository')
    private harvestPrisma: HarvestPrismaRepository,
    private prismaService: PrismaService,
    private stripeUsageSubscriptionService: StripeUsageSubscriptionService,
    @InjectSentry() private readonly sentryService: SentryService,
    private authAbilityFactory: AuthAbilityFactory
  ) {}

  async getWithPaginate(
    params: GetAllHarvestPayload,
    user: User
  ): Promise<any> {
    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.READ, 'Harvest')) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      return await this.harvestPrisma.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          speciesId: true,
          harvestDeliveryVesselCountryId: true,
          productFormId: true,
          productFormat: true,
          productState: true,
          harvestScale: true,
          harvestDeliveryMethod: true,
          harvestDeliveryMethodRef: true,
          harvestWeightUnit: true,
          harvestWeightValue: true,
          productDescription: true,
          totalSmallVessels: true,
          vesselId: true,
          gearTypeId: true,
          landingType: true,
          IFTP: true,
          landingTypeDetails: true,
          departureDate: true,
          tripStartDate: true,
          tripEndDate: true,
          landingDate: true,
          tariffId: true,
          harvestType: true,
          programs: true,
          importId: true,
          totalFarms: true,
          totalVessels: true,
          facility: true,
          typeFarmHarvest: true,
          typeWildHarvest: true,
          conditionalData: true,
          documents: true,
          organizationId: true,
          creatorId: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          importId:
            params.importId && this.generatorHelper.isBigInt(params.importId)
              ? BigInt(params.importId)
              : undefined,
          organizationId: user.organizationId,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(
    params: SearchHarvestPayload,
    user?: User
  ): Promise<any> {
    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.READ, 'Harvest')) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      return await this.harvestPrisma.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          creatorId: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
        },
        include: undefined,
        relationIds: [
          'exportFromId',
          'importToId',
          'organizationId',
          'creatorId',
        ],
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetail(id?: string | bigint, user?: User): Promise<any> {
    try {
      if (!user || !user.id) {
        throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
      }

      if (!this.generatorHelper.isBigInt(id.toString())) {
        throw new BadRequestException(RESPONSE_MESSAGE.harvests.notFound);
      }

      const _harvest: any = await this.harvestPrisma.first(id, {
        include: {
          species: true,
          productForm: true,
          harvestDeliveryEEZ: true,
          vessel: true,
          harvestVessel: {
            include: {
              flag: true,
            },
          },
          gearType: true,
          import: true,
          documents: true,
          harvestProgram: {
            include: {
              simpHarvestAuthorizatiorRFMO: true,
              simpHarvestAuthorizationCountry: true,
            },
          },
          permits: true,
          tariff: true,
          eez: true,
          fao: true,
          rfmo: true,
          catair: true,
          contacts: {
            include: {
              address: true,
            },
          },
          organization: true,
          creator: {
            select: {
              id: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          harvestDeliveryVesselCountry: true,
        },
      });

      //HoangHN - 04/05/2023: Format for front-end
      if (_harvest?.contacts && _harvest?.contacts?.length > 0) {
        _harvest.contacts.map((item) => {
          if (item.type === ContactType.DELIVERY) {
            _harvest['deliveryContact'] = item;
          }
          if (item.type === ContactType.NORMAL) {
            _harvest['farmContact'] = item;
          }
        });
      }

      if (!_harvest || !_harvest.id) {
        throw new NotFoundException(RESPONSE_MESSAGE.harvests.notFound);
      }

      const ability = await this.authAbilityFactory.forUser(user);
      if (ability.cannot(PERMISSIONS.READ, subject('Harvest', _harvest))) {
        throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
      }
      _harvest.publicId = this.generatorHelper.bigIntToHex(_harvest.id);
      return _harvest;
    } catch (err) {
      throw err;
    }
  }

  async getDetailPublic(id?: string | bigint): Promise<any> {
    try {
      id = this.generatorHelper.hexToBigInt(id.toString());
      console.log(id);
      const _harvest: any = await this.harvestPrisma.first(id, {
        include: {
          species: true,
          productForm: true,
          harvestDeliveryEEZ: true,
          vessel: true,
          harvestVessel: {
            include: {
              flag: true,
            },
          },
          gearType: true,
          import: {
            include: {
              importTo: true,
              exportFrom: true,
            },
          },
          documents: true,
          harvestProgram: {
            include: {
              simpHarvestAuthorizatiorRFMO: true,
              simpHarvestAuthorizationCountry: true,
            },
          },
          permits: true,
          tariff: true,
          eez: true,
          fao: true,
          rfmo: true,
          catair: true,
          contacts: {
            include: {
              address: true,
            },
          },
          organization: true,
          creator: {
            select: {
              id: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          harvestDeliveryVesselCountry: true,
        },
      });

      //HoangHN - 04/05/2023: Format for front-end
      if (_harvest?.contacts && _harvest?.contacts?.length > 0) {
        _harvest.contacts.map((item) => {
          if (item.type === ContactType.DELIVERY) {
            _harvest['deliveryContact'] = item;
          }
          if (item.type === ContactType.NORMAL) {
            _harvest['farmContact'] = item;
          }
        });
      }

      if (!_harvest || !_harvest.id) {
        throw new NotFoundException(RESPONSE_MESSAGE.harvests.notFound);
      }
      return _harvest;
    } catch (err) {
      throw err;
    }
  }

  async create(
    user: User,
    createHarvestPayload: CreateHarvestPayload
  ): Promise<any> {
    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.CREATE, 'Harvest')) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      // check payment stripe
      const checkPaymentStripe =
        await this.stripeUsageSubscriptionService.checkPaymentStripe(user);
      if (
        typeof checkPaymentStripe?.type === 'undefined' ||
        !checkPaymentStripe?.type
      ) {
        throw new BadRequestException(RESPONSE_MESSAGE.stripePayment.notPay);
      }

      const harvest = await this.harvestPrisma.create({
        id: this.generatorHelper.generateSnowflakeId(),
        import: {
          connect: { id: BigInt(createHarvestPayload.importId) },
        },
        creator: {
          connect: { id: user.id },
        },
        organization: {
          connect: { id: user.organizationId },
        },
      });

      // Save used service
      await this.stripeUsageSubscriptionService.saveStripeUsageSubscriptionQueue(
        user.id,
        harvest.id,
        UsedType.HARVEST,
        'create'
      );

      return this.getDetail(harvest.id, user);
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async checkUpdateHarvest(
    user: User,
    updateHarvestPayload: UpdateHarvestPayload,
    detail: any
  ) {
    let flag = false;
    if (
      !isUndefined(updateHarvestPayload.speciesId) &&
      this.generatorHelper.isBigInt(updateHarvestPayload.speciesId) &&
      detail.speciesId !== updateHarvestPayload.speciesId &&
      detail.speciesId
    ) {
      flag = true;
    }

    if (
      this.generatorHelper.checkEmptyField(
        detail,
        updateHarvestPayload,
        'productDescription'
      ) &&
      detail.productDescription
    ) {
      flag = true;
    }

    if (
      this.generatorHelper.checkEmptyField(
        detail,
        updateHarvestPayload,
        'productState'
      ) &&
      detail.productState
    ) {
      flag = true;
    }

    if (
      !isUndefined(updateHarvestPayload.tariffId) &&
      this.generatorHelper.isBigInt(updateHarvestPayload.tariffId) &&
      detail.tariffId !== updateHarvestPayload.tariffId &&
      detail.tariffId
    ) {
      flag = true;
    }

    if (
      this.generatorHelper.checkEmptyField(
        detail,
        updateHarvestPayload,
        'harvestType'
      ) &&
      detail.harvestType
    ) {
      flag = true;
    }

    return flag;
  }

  async update(
    user: User,
    id: bigint,
    updateHarvestPayload: UpdateHarvestPayload
  ): Promise<any> {
    // check payment stripe
    const checkPaymentStripe =
      await this.stripeUsageSubscriptionService.checkPaymentStripe(user);
    if (
      typeof checkPaymentStripe?.type === 'undefined' ||
      !checkPaymentStripe?.type
    ) {
      throw new BadRequestException(RESPONSE_MESSAGE.stripePayment.notPay);
    }
    await this.stripeUsageSubscriptionService.saveStripeUsageSubscriptionQueue(
      user.id,
      id,
      UsedType.HARVEST,
      'update'
    );

    const detail = await this.getDetail(id, user);
    if (!detail) throw new BadRequestException('Not Found Harvest Record');
    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.UPDATE, subject('Harvest', detail))) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    // check update used stripe
    const checkUpdateHarvest = await this.checkUpdateHarvest(
      user,
      updateHarvestPayload,
      detail
    );
    if (checkUpdateHarvest) {
      // Save used service
      await this.stripeUsageSubscriptionService.saveStripeUsageSubscriptionQueue(
        user.id,
        id,
        UsedType.HARVEST,
        'update'
      );
    }

    console.log('after check role');
    try {
      await this.prismaService.$transaction(async (tx) => {
        const updateData: any = {};
        console.log('Begin Transaction');
        //HoangHN: Begin of SpeciesProduct
        if (
          !isUndefined(updateHarvestPayload.speciesId) &&
          this.generatorHelper.isBigInt(updateHarvestPayload.speciesId)
        ) {
          updateData['species'] = {
            connect: {
              id: BigInt(updateHarvestPayload.speciesId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.speciesId
          )
        ) {
          updateData['species'] = {
            disconnect: true,
          };
        }

        // if (updateHarvestPayload.productDescription) {
        //   updateData['productDescription'] =
        //       updateHarvestPayload.productDescription;
        // }
        updateData['productDescription'] = this.generatorHelper.checkEmpty(
          detail,
          updateHarvestPayload,
          'productDescription'
        );

        if (updateHarvestPayload.productFormat) {
          updateData['productFormat'] =
            updateHarvestPayload.productFormat === ProductFormat.FRESH
              ? ProductFormat.FRESH
              : ProductFormat.FROZEN;
        }

        // if (updateHarvestPayload.productState) {
        //   updateData['productState'] = updateHarvestPayload.productState;
        // }
        updateData['productState'] = this.generatorHelper.checkEmpty(
          detail,
          updateHarvestPayload,
          'productState'
        );

        if (!isUndefined(updateHarvestPayload.isDolphinSafe)) {
          updateData['isDolphinSafe'] = updateHarvestPayload.isDolphinSafe;
        }

        if (
          !isUndefined(updateHarvestPayload.tariffId) &&
          this.generatorHelper.isBigInt(updateHarvestPayload.tariffId)
        ) {
          updateData['tariff'] = {
            connect: {
              id: BigInt(updateHarvestPayload.tariffId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.tariffId
          )
        ) {
          updateData['tariff'] = {
            disconnect: true,
          };
        }
        console.log('Half of Transaction');
        if (
          !isUndefined(updateHarvestPayload.documentId) &&
          this.generatorHelper.isBigInt(updateHarvestPayload.documentId)
        ) {
          updateData['documents'] = {
            connect: {
              id: BigInt(updateHarvestPayload.documentId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.documentId
          )
        ) {
          updateData['documents'] = {
            disconnect: true,
          };
        }

        // if (updateHarvestPayload.harvestWeightValue) {
        //   updateData['harvestWeightValue'] =
        //       updateHarvestPayload.harvestWeightValue;
        // }
        updateData['harvestWeightValue'] = this.generatorHelper.checkEmpty(
          detail,
          updateHarvestPayload,
          'harvestWeightValue'
        );

        if (updateHarvestPayload.harvestWeightUnit) {
          updateData['harvestWeightUnit'] =
            updateHarvestPayload.harvestWeightUnit === HarvestWeightUnit.KG
              ? HarvestWeightUnit.KG
              : HarvestWeightUnit.LBS;
        }

        if (updateHarvestPayload.farmContact) {
          await tx.contact.deleteMany({
            where: {
              harvestId: BigInt(id),
              type: ContactType.NORMAL,
            },
          });
          await tx.contact.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              type: ContactType.NORMAL,
              name: updateHarvestPayload.farmContact.name,
              address: {
                create: {
                  id: this.generatorHelper.generateSnowflakeId(),
                  address: updateHarvestPayload.farmContact.address,
                  unit: updateHarvestPayload.farmContact.unit,
                  city: updateHarvestPayload.farmContact.city,
                  state: updateHarvestPayload.farmContact.state,
                  country: updateHarvestPayload.farmContact.country,
                  zipcode: updateHarvestPayload.farmContact.zipcode,
                  phone: updateHarvestPayload.farmContact.phone,
                },
              },
              harvestId: BigInt(id),
            },
          });
        }

        //HoangHN: End of SpeciesProduct

        //HoangHN: Begin of HarvestArea

        if (
          !isUndefined(updateHarvestPayload.eezId) &&
          this.generatorHelper.isBigInt(updateHarvestPayload.eezId)
        ) {
          updateData['eez'] = {
            connect: {
              id: BigInt(updateHarvestPayload.eezId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.eezId
          )
        ) {
          updateData['eez'] = {
            disconnect: true,
          };
        }

        if (
          !isUndefined(updateHarvestPayload.faoId) &&
          this.generatorHelper.isBigInt(updateHarvestPayload.faoId)
        ) {
          updateData['fao'] = {
            connect: {
              id: BigInt(updateHarvestPayload.faoId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.faoId
          )
        ) {
          updateData['fao'] = {
            disconnect: true,
          };
        }

        if (
          !isUndefined(updateHarvestPayload.rfmoId) &&
          this.generatorHelper.isBigInt(updateHarvestPayload.rfmoId)
        ) {
          updateData['rfmo'] = {
            connect: {
              id: BigInt(updateHarvestPayload.rfmoId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.rfmoId
          )
        ) {
          updateData['rfmo'] = {
            disconnect: true,
          };
        }

        if (
          !isUndefined(updateHarvestPayload.catairId) &&
          this.generatorHelper.isBigInt(updateHarvestPayload.catairId)
        ) {
          updateData['catair'] = {
            connect: {
              id: BigInt(updateHarvestPayload.catairId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.catairId
          )
        ) {
          updateData['catair'] = {
            disconnect: true,
          };
        }
        //HoangHN: End of HarvestArea

        //HoangHN: Begin of HarvestVessel
        if (
          !isUndefined(updateHarvestPayload.harvestType) &&
          updateHarvestPayload.harvestType !== 'null' &&
          updateHarvestPayload.harvestType === 'WILD'
        ) {
          updateData['totalSmallVessels'] =
            updateHarvestPayload.totalSmallVessels;
        }
        console.log('Half of Transaction 1');
        await this.updateHarvestVessel(tx, id, user, updateHarvestPayload);
        //
        // // TODO never update yet.
        // if (updateHarvestPayload.harvestVesselIMO) {
        //   updateData['harvestVesselIMO'] =
        //     updateHarvestPayload.harvestVesselIMO;
        // }

        if (
          !isUndefined(updateHarvestPayload.gearTypeId) &&
          this.generatorHelper.isBigInt(updateHarvestPayload.gearTypeId)
        ) {
          updateData['gearType'] = {
            connect: {
              id: BigInt(updateHarvestPayload.gearTypeId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.gearTypeId
          )
        ) {
          updateData['gearType'] = {
            disconnect: true,
          };
        }

        //HoangHN: End of HarvestVessel

        //HoangHN: Begin of Permits
        await this.updateHarvestProgram(tx, id, user, updateHarvestPayload);

        await this.updateHarvestPermit(tx, id, user, updateHarvestPayload);

        updateData['IFTP'] = this.generatorHelper.checkEmpty(
          detail,
          updateHarvestPayload,
          'IFTP'
        );

        //HoangHN: End of Permits

        //HoangHN: Begin of HarvestEvent

        // if (updateHarvestPayload.tripStartDate) {
        // updateData['tripStartDate'] = moment(
        //   updateHarvestPayload.tripStartDate
        // )
        //   .utc()
        //   .toDate();
        //   updateData['tripStartDate'] = updateHarvestPayload.tripStartDate;
        // }
        updateData['tripStartDate'] = this.generatorHelper.checkEmpty(
          detail,
          updateHarvestPayload,
          'tripStartDate'
        );

        // if (updateHarvestPayload.tripEndDate) {
        // updateData['tripEndDate'] = moment(
        //   updateHarvestPayload.tripEndDate
        // )
        //   .utc()
        //   .toDate();
        //   updateData['tripEndDate'] = updateHarvestPayload.tripEndDate;
        // }
        updateData['tripEndDate'] = this.generatorHelper.checkEmpty(
          detail,
          updateHarvestPayload,
          'tripEndDate'
        );

        // if (updateHarvestPayload.departureDate) {
        // updateData['landingDate'] = moment(
        //   updateHarvestPayload.landingDate
        // )
        //   .utc()
        //   .format('YYYY-MM-DD HH:mm:ss:SSS');

        // updateData['departureDate'] = updateHarvestPayload.departureDate;
        // }
        updateData['departureDate'] = this.generatorHelper.checkEmpty(
          detail,
          updateHarvestPayload,
          'departureDate'
        );

        // if (updateHarvestPayload.landingDate) {
        // updateData['landingDate'] = moment(
        //   updateHarvestPayload.landingDate
        // )
        //   .utc()
        //   .format('YYYY-MM-DD HH:mm:ss:SSS');

        //   updateData['landingDate'] = updateHarvestPayload.landingDate;
        // }
        updateData['landingDate'] = this.generatorHelper.checkEmpty(
          detail,
          updateHarvestPayload,
          'landingDate'
        );

        // if (updateHarvestPayload.conditionalData) {
        //   updateData['conditionalData'] = updateHarvestPayload.conditionalData;
        // }
        updateData['conditionalData'] = this.generatorHelper.checkEmpty(
          detail,
          updateHarvestPayload,
          'conditionalData'
        );

        if (
          !isUndefined(updateHarvestPayload.productFormId) &&
          this.generatorHelper.isBigInt(updateHarvestPayload.productFormId)
        ) {
          updateData['productForm'] = {
            connect: {
              id: BigInt(updateHarvestPayload.productFormId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.productFormId
          )
        ) {
          updateData['productForm'] = {
            disconnect: true,
          };
        }

        if (
          !isUndefined(updateHarvestPayload.harvestType) &&
          updateHarvestPayload.harvestType !== 'null'
        ) {
          updateData['harvestType'] = this.generatorHelper.checkEmpty(
            detail,
            updateHarvestPayload,
            'harvestType'
          );
        }

        if (!isUndefined(updateHarvestPayload.harvestScale)) {
          switch (updateHarvestPayload.harvestScale) {
            case 'SMALL':
              updateHarvestPayload.harvestScale = 'SMALL';
              break;
            case 'LARGE':
              updateHarvestPayload.harvestScale = 'LARGE';
              break;
            default:
              updateHarvestPayload.harvestScale = null;
              break;
          }
          updateData['harvestScale'] = updateHarvestPayload.harvestScale;
        }

        if (updateHarvestPayload.harvestDeliveryMethod) {
          if (
            updateHarvestPayload.harvestDeliveryMethod ===
            HarvestDeliveryMethod.VESSEL
          ) {
            console.log('updateHarvestPayload', updateHarvestPayload);
            updateData['harvestDeliveryMethod'] = HarvestDeliveryMethod.VESSEL;
            updateData['harvestDeliveryMethodRef'] =
              HarvestDeliveryMethodRef.sEEZ;

            if (
              updateHarvestPayload.harvestDeliveryEEZId &&
              this.generatorHelper.isBigInt(
                updateHarvestPayload.harvestDeliveryEEZId
              )
            ) {
              updateData['harvestDeliveryEEZ'] = {
                connect: {
                  id: BigInt(updateHarvestPayload.harvestDeliveryEEZId),
                },
              };
            } else if (updateHarvestPayload.harvestDeliveryEEZId === null) {
              updateData['harvestDeliveryEEZ'] = {
                disconnect: true,
              };
            }
          }

          if (
            updateHarvestPayload.harvestDeliveryMethod ===
            HarvestDeliveryMethod.LAND
          ) {
            updateData['harvestDeliveryMethod'] = HarvestDeliveryMethod.LAND;
            updateData['harvestDeliveryMethodRef'] =
              HarvestDeliveryMethodRef.Contact;

            if (updateHarvestPayload.deliveryContact) {
              await tx.contact.deleteMany({
                where: {
                  harvestId: BigInt(id),
                  type: ContactType.DELIVERY,
                },
              });
              await tx.contact.create({
                data: {
                  id: this.generatorHelper.generateSnowflakeId(),
                  type: ContactType.DELIVERY,
                  name: updateHarvestPayload.deliveryContact.name,
                  address: {
                    create: {
                      id: this.generatorHelper.generateSnowflakeId(),
                      address: updateHarvestPayload.deliveryContact.address,
                      unit: updateHarvestPayload.deliveryContact.unit,
                      city: updateHarvestPayload.deliveryContact.city,
                      state: updateHarvestPayload.deliveryContact.state,
                      country: updateHarvestPayload.deliveryContact.country,
                      zipcode: updateHarvestPayload.deliveryContact.zipcode,
                      phone: updateHarvestPayload.deliveryContact.phone,
                    },
                  },
                  harvestId: BigInt(id),
                },
              });
            }
          }
        }

        if (
          !isUndefined(updateHarvestPayload.harvestType) &&
          updateHarvestPayload.harvestType !== 'null' &&
          updateHarvestPayload.harvestScale
        ) {
          if (
            updateHarvestPayload.harvestType === 'FARM' &&
            updateHarvestPayload.harvestScale === 'SMALL'
          ) {
            updateData['totalFarms'] = updateHarvestPayload.totalFarms;
            updateData['typeFarmHarvest'] = TypeFarmHarvest.SMALL;
          }

          if (
            updateHarvestPayload.harvestType === 'FARM' &&
            updateHarvestPayload.harvestScale === 'LARGE'
          ) {
            // TODO
            updateData['typeFarmHarvest'] = TypeFarmHarvest.LARGE;
          }

          if (
            updateHarvestPayload.harvestType === 'WILD' &&
            updateHarvestPayload.harvestScale === 'SMALL'
          ) {
            updateData['totalVessels'] = updateHarvestPayload.totalVessels;
            updateData['typeWildHarvest'] = TypeWildHarvest.SMALL;
          }

          if (
            updateHarvestPayload.harvestType === 'WILD' &&
            updateHarvestPayload.harvestScale === 'LARGE'
          ) {
            // TODO
            updateData['typeWildHarvest'] = TypeWildHarvest.LARGE;
            if (
              updateHarvestPayload.harvestDeliveryVesselId &&
              this.generatorHelper.isBigInt(
                updateHarvestPayload.harvestDeliveryVesselId
              )
            ) {
              updateData['vessel'] = {
                connect: {
                  id: BigInt(updateHarvestPayload.harvestDeliveryVesselId),
                },
              };
            } else if (updateHarvestPayload.harvestDeliveryVesselId === null) {
              updateData['vessel'] = {
                disconnect: true,
              };
            }
          }
        }

        if (
          !isUndefined(updateHarvestPayload.harvestDeliveryVesselName) &&
          updateHarvestPayload.harvestDeliveryVesselName !== 'null'
        ) {
          updateData['harvestDeliveryVesselName'] =
            this.generatorHelper.checkEmpty(
              detail,
              updateHarvestPayload,
              'harvestDeliveryVesselName'
            );
        }

        if (
          !isUndefined(updateHarvestPayload.harvestDeliveryVesselCountryId) &&
          this.generatorHelper.isBigInt(
            updateHarvestPayload.harvestDeliveryVesselCountryId
          )
        ) {
          updateData['harvestDeliveryVesselCountry'] = {
            connect: {
              id: BigInt(updateHarvestPayload.harvestDeliveryVesselCountryId),
            },
          };
        } else if (
          this.generatorHelper.validateRemoveRelationShip(
            updateHarvestPayload.harvestDeliveryVesselCountryId
          )
        ) {
          updateData['harvestDeliveryVesselCountry'] = {
            disconnect: true,
          };
        }
        console.log('End of Transaction');
        //HoangHN: End of HarvestEvent
        return tx.harvest.update({
          data: updateData,
          where: {
            id: BigInt(id),
          },
        });
      });
      return this.getDetail(id, user);
    } catch (e) {
      console.log(e);
      this.sentryService.instance().captureException(e);
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async delete(
    user: User,
    deleteHarvestPayload: DeleteHarvestPayload
  ): Promise<boolean> {
    const _harvest = await this.harvestPrisma.first(deleteHarvestPayload.id);

    if (!_harvest || !_harvest.id) {
      throw new NotFoundException(RESPONSE_MESSAGE.harvests.notFound);
    }

    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.DELETE, subject('Harvest', _harvest))) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      return await this.prismaService.$transaction(async (tx) => {
        await tx.harvestProgram.deleteMany({
          where: {
            harvestId: BigInt(deleteHarvestPayload.id),
          },
        });
        await tx.harvestVessel.deleteMany({
          where: {
            harvestId: BigInt(deleteHarvestPayload.id),
          },
        });
        await tx.contact.deleteMany({
          where: {
            harvestId: BigInt(deleteHarvestPayload.id),
          },
        });
        await tx.permit.deleteMany({
          where: {
            harvestId: BigInt(deleteHarvestPayload.id),
          },
        });

        const _delete = await tx.harvest.deleteMany({
          where: {
            id: BigInt(deleteHarvestPayload.id),
            organizationId: user.organizationId,
          },
        });

        return _delete.count === 1;
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async updateHarvestVessel(
    tx: Prisma.TransactionClient,
    _harvestId: bigint,
    _user: User,
    _payload: UpdateHarvestPayload
  ): Promise<any> {
    const _harvestVessel = await tx.harvestVessel.findUnique({
      where: {
        harvestId: BigInt(_harvestId),
      },
    });

    await tx.harvestVessel.deleteMany({
      where: {
        harvestId: BigInt(_harvestId),
      },
    });

    const data = {
      id: this.generatorHelper.generateSnowflakeId(),
      name: this.generatorHelper.checkEmptyOther(
        _harvestVessel?.name,
        _payload,
        'harvestVesselName'
      ), // _payload.harvestVesselName || _harvestVessel?.name,
      imo: this.generatorHelper.checkEmptyOther(
        _harvestVessel?.imo,
        _payload,
        'harvestVesselIMO'
      ),
      ircs: this.generatorHelper.checkEmptyOther(
        _harvestVessel?.ircs,
        _payload,
        'harvestVesselIRSC'
      ),
      mmsi: this.generatorHelper.checkEmptyOther(
        _harvestVessel?.mmsi,
        _payload,
        'harvestVesselMMSI'
      ),
      nationalRegistry: this.generatorHelper.checkEmptyOther(
        _harvestVessel?.nationalRegistry,
        _payload,
        'harvestVesselNationalRegistry'
      ),
      harvest: {
        connect: { id: BigInt(_harvestId) },
      },
      creator: {
        connect: { id: _user.id },
      },
      organization: {
        connect: { id: _user.organizationId },
      },
      flag:
        _payload.harvestVesselFlagId &&
        this.generatorHelper.isBigInt(_payload.harvestVesselFlagId)
          ? {
              connect: {
                id: BigInt(
                  _payload.harvestVesselFlagId || _harvestVessel?.flagId
                ),
              },
            }
          : undefined,
    };
    await tx.harvestVessel.create({
      data: data,
    });
  }

  async updateHarvestProgram(
    tx: Prisma.TransactionClient,
    _harvestId: bigint,
    _user: User,
    _payload: UpdateHarvestPayload
  ): Promise<any> {
    const _harvestProgram = await tx.harvestProgram.findUnique({
      where: {
        harvestId: BigInt(_harvestId),
      },
    });
    console.log(_harvestProgram);
    await tx.harvestProgram.deleteMany({
      where: {
        harvestId: BigInt(_harvestId),
      },
    });

    const data = {
      id: this.generatorHelper.generateSnowflakeId(),
      simpHarvestAuthorizationBody: this.generatorHelper.checkEmptyOther(
        _harvestProgram?.simpHarvestAuthorizationBody,
        _payload,
        'simpHarvestAuthorizationBody'
      ),
      harvest: {
        connect: { id: BigInt(_harvestId) },
      },
      creator: {
        connect: { id: _user.id },
      },
      organization: {
        connect: { id: _user.organizationId },
      },
      simpHarvestAuthorizatiorRFMO:
        !isUndefined(_payload?.simpHarvestAuthorizationRFMOId) &&
        this.generatorHelper.isBigInt(_payload?.simpHarvestAuthorizationRFMOId)
          ? {
              connect: {
                id: BigInt(_payload.simpHarvestAuthorizationRFMOId),
              },
            }
          : this.generatorHelper.validateRemoveRelationShip(
              _payload.simpHarvestAuthorizationRFMOId
            )
          ? undefined
          : !isUndefined(_harvestProgram?.simpHarvestAuthorizationRFMOId) &&
            !this.generatorHelper.validateRemoveRelationShip(
              _harvestProgram?.simpHarvestAuthorizationRFMOId
            )
          ? {
              connect: {
                id: _harvestProgram.simpHarvestAuthorizationRFMOId,
              },
            }
          : undefined,
      simpHarvestAuthorizationCountry:
        !isUndefined(_payload?.simpHarvestAuthorizationCountryId) &&
        this.generatorHelper.isBigInt(
          _payload?.simpHarvestAuthorizationCountryId
        )
          ? {
              connect: {
                id: BigInt(_payload.simpHarvestAuthorizationCountryId),
              },
            }
          : this.generatorHelper.validateRemoveRelationShip(
              _payload.simpHarvestAuthorizationCountryId
            )
          ? undefined
          : !isUndefined(_harvestProgram?.simpHarvestAuthorizationCountryId) &&
            !this.generatorHelper.validateRemoveRelationShip(
              _harvestProgram?.simpHarvestAuthorizationCountryId
            )
          ? {
              connect: {
                id: _harvestProgram.simpHarvestAuthorizationCountryId,
              },
            }
          : undefined,
    };

    await tx.harvestProgram.create({
      data: data,
    });
  }

  async updateHarvestPermit(
    tx: Prisma.TransactionClient,
    _harvestId: bigint,
    _user: User,
    _payload: UpdateHarvestPayload
  ): Promise<any> {
    const _harvestPermit = await tx.permit.findFirst({
      where: {
        harvestId: BigInt(_harvestId),
      },
    });

    await tx.permit.deleteMany({
      where: {
        harvestId: BigInt(_harvestId),
      },
    });

    const data = {
      id: this.generatorHelper.generateSnowflakeId(),
      issuer:
        this.generatorHelper.checkEmptyOther(
          _harvestPermit?.issuer,
          _payload,
          'permitIssuingAgency'
        ) || '',
      value:
        this.generatorHelper.checkEmptyOther(
          _harvestPermit?.value,
          _payload,
          'permitNumber'
        ) || '',
      harvest: {
        connect: { id: BigInt(_harvestId) },
      },
    };

    await tx.permit.create({
      data: data,
    });
  }
}
