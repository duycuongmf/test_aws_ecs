import { Inject, Injectable } from '@nestjs/common';
import { sVesselRegistration } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { SearchVesselRegistrationPayload } from '../payload/vessel/search-vessel-registration.payload';

@Injectable()
export class VesselRegistrationService {
  constructor(
    @Inject('VesselRegistrationRepository')
    private readonly vesselRegistrationRepository: RepositoryInterface<sVesselRegistration>
  ) {}

  async getWithSearch(params: SearchVesselRegistrationPayload): Promise<any> {
    try {
      return await this.vesselRegistrationRepository.search({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          type: true,
          value: true,
          vesselId: true,
          createdAt: true,
          updatedAt: true,
        },
        type: params.type,
        query: params.query,
        fields: params.fields,
        relationIds: ['vesselId'],
        include: params.include ? { vessel: true } : undefined,
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetail(id?: string | bigint): Promise<sVesselRegistration> {
    try {
      return await this.vesselRegistrationRepository.first(id, {
        include: {
          vessel: true,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
