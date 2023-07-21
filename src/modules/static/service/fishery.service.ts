import { Inject, Injectable } from '@nestjs/common';
import { sFishery } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { GetAllFisheryPayload } from '../payload/fishery/get-all-fishery.payload';
import { SearchFisheryPayload } from '../payload/fishery/search-fishery.payload';
import { FindSpecialFisheryPayload } from '../payload/fishery/find-special-fishery.payload';
import { GeneratorHelper } from '../../../shared/helpers/generator.helper';

@Injectable()
export class FisheryService {
  constructor(
    @Inject('FisheryRepository')
    private readonly fisheryRepository: RepositoryInterface<sFishery>,
    private generatorHelper: GeneratorHelper
  ) {}

  async getWithPaginate(params: GetAllFisheryPayload): Promise<any> {
    try {
      return await this.fisheryRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          fisheryId: true,
          loffId: true,
          speciesId: true,
          countryId: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          countryId: params.countryId ? BigInt(params.countryId) : undefined,
          speciesId: params.speciesId ? BigInt(params.speciesId) : undefined,
          loffId: params.loffId || undefined,
          fisheryId: params.fisheryId || undefined,
        },
        include: {
          country: true,
          rfmos: {
            include: {
              rfmo: true,
            },
          },
          eezs: {
            include: {
              eez: true,
            },
          },
          faos: {
            include: {
              fao: true,
            },
          },
          species: true,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchFisheryPayload): Promise<any> {
    try {
      return await this.fisheryRepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        include: params.include
          ? {
              country: true,
              rfmos: {
                include: {
                  rfmo: true,
                },
              },
              eezs: {
                include: {
                  eez: true,
                },
              },
              faos: {
                include: {
                  fao: true,
                },
              },
              species: true,
              gearTypes: {
                include: {
                  gearType: true,
                },
              },
            }
          : undefined,
        select: {
          id: true,
          fisheryId: true,
          loffId: true,
          speciesId: true,
          countryId: true,
          createdAt: true,
          updatedAt: true,
        },
        relationIds: ['speciesId', 'countryId'],
        // where: {
        //   countryId: params.countryId ? BigInt(params.countryId) : undefined,
        //   speciesId: params.speciesId ? BigInt(params.speciesId) : undefined,
        //   loffId: params.loffId || undefined,
        //   fisheryId: params.fisheryId || undefined,
        // },
      });
    } catch (err) {
      throw err;
    }
  }

  async findSpecialWithPaginate(
    params: FindSpecialFisheryPayload
  ): Promise<any> {
    try {
      return await this.fisheryRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          fisheryId: true,
          loffId: true,
          speciesId: true,
          countryId: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          AND: {
            countryId:
              params.countryId &&
              this.generatorHelper.isBigInt(params.countryId)
                ? BigInt(params.countryId)
                : undefined,
            speciesId:
              params.speciesId &&
              this.generatorHelper.isBigInt(params.speciesId)
                ? BigInt(params.speciesId)
                : undefined,
            gearTypes:
              params.gearId && this.generatorHelper.isBigInt(params.gearId)
                ? { some: { gearTypeId: BigInt(params.gearId) } }
                : undefined,
            OR: [
              {
                eezs:
                  params.eezId && this.generatorHelper.isBigInt(params.eezId)
                    ? { some: { eezId: BigInt(params.eezId) } }
                    : undefined,
              },
              {
                faos:
                  params.faoId && this.generatorHelper.isBigInt(params.faoId)
                    ? { some: { faoId: BigInt(params.faoId) } }
                    : undefined,
              },
              {
                rfmos:
                  params.rfmoId && this.generatorHelper.isBigInt(params.rfmoId)
                    ? { some: { rfmoId: BigInt(params.rfmoId) } }
                    : undefined,
              },
              {
                highSeas: params.highSeas ? params.highSeas : undefined,
              },
            ],
          },
        },
        include: {
          country: true,
          rfmos: {
            include: {
              rfmo: true,
            },
          },
          eezs: {
            include: {
              eez: true,
            },
          },
          faos: {
            include: {
              fao: true,
            },
          },
          species: true,
          gearTypes: {
            include: {
              gearType: true,
            },
          },
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetail(id?: string | bigint): Promise<sFishery> {
    try {
      return await this.fisheryRepository.first(id, {
        include: {
          country: true,
          rfmos: {
            include: {
              rfmo: true,
            },
          },
          eezs: {
            include: {
              eez: true,
            },
          },
          faos: {
            include: {
              fao: true,
            },
          },
          species: true,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
