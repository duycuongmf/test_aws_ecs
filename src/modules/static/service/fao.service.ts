import { Inject, Injectable } from '@nestjs/common';
import { sFAO } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { SearchFAOPayload } from '../payload/fao/search-fao.payload';

@Injectable()
export class FAOService {
  constructor(
    @Inject('FAORepository')
    private readonly faoRepository: RepositoryInterface<sFAO>
  ) {}

  async getWithPaginate(params: {
    name?: string;
    code?: string;
    skip?: number;
    take?: number;
    orderBy?: any;
  }): Promise<sFAO[]> {
    try {
      return await this.faoRepository.paginate({
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

  async searchWithPaginate(params: SearchFAOPayload): Promise<sFAO[]> {
    try {
      return await this.faoRepository.search({
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
              harvest: true,
              eezs: {
                include: {
                  eez: true,
                },
              },
              rfmos: {
                include: {
                  rfmo: true,
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

  async getDetail(id?: string | bigint): Promise<sFAO> {
    try {
      return await this.faoRepository.first(id);
    } catch (err) {
      throw err;
    }
  }

  async getByRelated(params: {
    rfmoId?: bigint;
    eezId?: bigint;
    catairId?: bigint;
  }): Promise<sFAO[]> {
    try {
      return await this.faoRepository.paginate({
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
          ...(params.rfmoId && {
            rfmos: {
              some: {
                rfmoId: BigInt(params.rfmoId),
              },
            },
          }),
          ...(params.eezId && {
            eezs: {
              some: {
                eezId: BigInt(params.eezId),
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
