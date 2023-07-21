import { Inject, Injectable } from '@nestjs/common';
import { sEEZ } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { SearchEEZPayload } from '../payload/eez/search-eez.payload';

@Injectable()
export class EEZService {
  constructor(
    @Inject('EEZRepository')
    private readonly eezRepository: RepositoryInterface<sEEZ>
  ) {}

  async getWithPaginate(params: {
    name?: string;
    code?: string;
    skip?: number;
    take?: number;
    orderBy?: any;
  }): Promise<sEEZ[]> {
    try {
      return await this.eezRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          mId: true,
          name: true,
          code: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          name: params.name || undefined,
          code: params.code || undefined,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchEEZPayload): Promise<any> {
    try {
      return await this.eezRepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          mId: true,
          name: true,
          code: true,
          alpha3: true,
          createdAt: true,
          updatedAt: true,
        },
        include: params.include
          ? {
              rfmos: {
                include: {
                  rfmo: true,
                },
              },
              faos: {
                include: {
                  fao: true,
                },
              },
              catairs: {
                include: {
                  catair: true,
                },
              },
              authorizedCountries: true,
              harvestDeliver: true,
              harvestEEZ: true,
              fisheries: {
                include: {
                  fishery: true,
                },
              },
            }
          : undefined,
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetail(id?: string | bigint): Promise<sEEZ> {
    try {
      return await this.eezRepository.first(id);
    } catch (err) {
      throw err;
    }
  }

  async getByRelated(params: {
    rfmoId?: bigint;
    faoId?: bigint;
    catairId?: bigint;
  }): Promise<sEEZ[]> {
    try {
      return await this.eezRepository.paginate({
        take: 100,
        select: {
          id: true,
          mId: true,
          name: true,
          code: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          {
            name: 'asc',
          },
        ],
        where: {
          ...(params.rfmoId && {
            rfmos: {
              some: {
                rfmoId: BigInt(params.rfmoId),
              },
            },
          }),
          ...(params.faoId && {
            faos: {
              some: {
                faoId: BigInt(params.faoId),
              },
            },
          }),
          ...(params.catairId && {
            catairs: {
              some: {
                catairId: BigInt(params.catairId),
              },
            },
          }),
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
