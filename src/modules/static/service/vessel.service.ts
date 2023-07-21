import { Injectable } from '@nestjs/common';
import { sVessel, Prisma } from '@prisma/client';
import { VesselRepository } from '../repository/vessel/vessel.repository';
import { SearchVesselPayload } from '../payload/vessel/search-vessel.payload';

@Injectable()
export class VesselService {
  constructor(private vesselRepository: VesselRepository) {}

  async getVessels(params: {
    name?: string;
    mmsi?: string;
    ircs?: string;
    imo?: string;
    national?: string;
    skip?: number;
    take?: number;
    cursor?: Prisma.sVesselWhereUniqueInput;
    orderBy?: any;
  }): Promise<sVessel[]> {
    try {
      return await this.vesselRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          mId: true,
          name: true,
          IRCS: true,
          IMO: true,
          MMSI: true,
          nationalRegistry: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          name: params.name || undefined,
          MMSI: params.mmsi || undefined,
          IMO: params.imo || undefined,
          IRCS: params.ircs || undefined,
          nationalRegistry: params.national || undefined,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchVesselPayload): Promise<any> {
    try {
      return await this.vesselRepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        include: params.include
          ? { country: true, registrations: true }
          : undefined,
        select: {
          id: true,
          mId: true,
          name: true,
          IRCS: true,
          IMO: true,
          MMSI: true,
          nationalRegistry: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetail(id?: string | bigint): Promise<sVessel> {
    try {
      return await this.vesselRepository.first(id);
    } catch (err) {
      throw err;
    }
  }
}
