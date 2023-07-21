import { Inject, Injectable } from '@nestjs/common';
import { sGearType } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { GetAllGearTypePayload } from '../payload/gear-type/get-all-gear-type.payload';
import { SearchGearTypePayload } from '../payload/gear-type/search-gear-type.payload';

@Injectable()
export class GearTypeService {
  constructor(
    @Inject('GearTypeRepository')
    private readonly gearTypeRepository: RepositoryInterface<sGearType>
  ) {}

  async getWithPaginate(params: GetAllGearTypePayload): Promise<any> {
    try {
      return await this.gearTypeRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          code: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          name: params.name || undefined,
          type: params.type || undefined,
          code: params.code || undefined,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchGearTypePayload): Promise<any> {
    try {
      return await this.gearTypeRepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          code: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
        include: params.include
          ? {
              harvests: true,
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

  async getDetail(id?: string | bigint): Promise<sGearType> {
    try {
      return await this.gearTypeRepository.first(id);
    } catch (err) {
      throw err;
    }
  }
}
