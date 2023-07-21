import { Inject, Injectable } from '@nestjs/common';
import { sCatair } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import {
  SearchCatairPayload,
  SearchRelatedCatarPayload,
} from '../payload/catair/search-catair.payload';

@Injectable()
export class CatairService {
  constructor(
    @Inject('CatairRepository')
    private readonly catairRepository: RepositoryInterface<sCatair>
  ) {}

  async getWithPaginate(params: {
    name?: string;
    code?: string;
    description?: string;
    skip?: number;
    take?: number;
    orderBy?: any;
  }): Promise<sCatair[]> {
    try {
      return await this.catairRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          mId: true,
          name: true,
          code: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          name: params.name || undefined,
          code: params.code || undefined,
          description: params.description || undefined,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchCatairPayload): Promise<any> {
    try {
      return await this.catairRepository.search({
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
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        include: params.include
          ? {
              eezs: {
                include: {
                  eez: true,
                },
              },
              rfmos: {
                include: {
                  rmfo: true,
                },
              },
              faos: {
                include: {
                  fao: true,
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

  async getDetail(id?: string | bigint): Promise<sCatair> {
    try {
      return await this.catairRepository.first(id);
    } catch (err) {
      throw err;
    }
  }

  async getByRelated(params: {
    rfmoId?: bigint;
    eezId?: bigint;
    faoId?: bigint;
  }): Promise<sCatair[]> {
    try {
      return await this.catairRepository.paginate({
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
          ...(params.eezId && {
            eezs: {
              some: {
                eezId: BigInt(params.eezId),
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
