import { Inject, Injectable } from '@nestjs/common';
import { sRFMO } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { SearchRFMOPayload } from '../payload/rfmo/search-rfmo.payload';

@Injectable()
export class RFMOService {
  constructor(
    @Inject('RFMORepository')
    private readonly rfmoRepository: RepositoryInterface<sRFMO>
  ) {}

  async getWithPaginate(params: {
    name?: string;
    code?: string;
    skip?: number;
    take?: number;
    orderBy?: any;
  }): Promise<sRFMO[]> {
    try {
      return await this.rfmoRepository.paginate({
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

  async getDetail(id?: string | bigint): Promise<sRFMO> {
    try {
      return await this.rfmoRepository.first(id);
    } catch (err) {
      throw err;
    }
  }

  async getByRelated(params: {
    eezId?: bigint;
    faoId?: bigint;
    catairId?: bigint;
  }): Promise<sRFMO[]> {
    try {
      return await this.rfmoRepository.paginate({
        take: 100,
        select: {
          id: true,
          mId: true,
          name: true,
          code: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          ...(params.eezId && {
            eezs: {
              some: {
                eezId: BigInt(params.eezId),
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

  async searchWithPaginate(params: SearchRFMOPayload): Promise<any> {
    try {
      return await this.rfmoRepository.search({
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
          createdAt: true,
          updatedAt: true,
        },
        include: params.include
          ? {
              harvests: true,
              memberCountries: true,
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
              catairs: {
                include: {
                  catair: true,
                },
              },
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
}
