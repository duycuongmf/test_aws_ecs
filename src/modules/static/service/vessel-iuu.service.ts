import { Inject, Injectable } from '@nestjs/common';
import { sVesselIUU } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { GetAllVesselIUUPayload } from '../payload/vessel/get-all-vessel-iuu.payload';
import { SearchVesselIUUPayload } from '../payload/vessel/search-vessel-iuu.payload';

@Injectable()
export class VesselIUUService {
  constructor(
    @Inject('VesselIUURepository')
    private readonly vesselIUURepository: RepositoryInterface<sVesselIUU>
  ) {}

  async getWithPaginate(params: GetAllVesselIUUPayload): Promise<any> {
    try {
      return await this.vesselIUURepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          mId: true,
          name: true,
          IRCS: true,
          IMO: true,
          MMSI: true,
          alias: true,
          nationalRegistry: true,
          country: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          OR: [
            params.name && { name: params.name },
            params.mmsi && { MMSI: params.mmsi },
            params.imo && { IMO: params.imo },
            params.ircs && { IRCS: params.ircs },
            params.national && { nationalRegistry: params.national },
          ],
        },
        include: params.include
          ? {
              country: true,
            }
          : undefined,
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchVesselIUUPayload): Promise<any> {
    try {
      return await this.vesselIUURepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          mId: true,
          name: true,
          IRCS: true,
          IMO: true,
          MMSI: true,
          alias: true,
          nationalRegistry: true,
          country: true,
          createdAt: true,
          updatedAt: true,
        },
        include: params.include
          ? {
              country: true,
            }
          : undefined,
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetail(id?: string | bigint): Promise<sVesselIUU> {
    try {
      return await this.vesselIUURepository.first(id);
    } catch (err) {
      throw err;
    }
  }
}
