import { BadRequestException, Injectable } from '@nestjs/common';
import { sSpecies, Prisma } from '@prisma/client';
import { SpeciesRepository } from '../repository/species/species.repository';
import { SearchSpeciesPayload } from '../payload/species/search-species.payload';

@Injectable()
export class SpeciesService {
  constructor(private speciesRepository: SpeciesRepository) {}

  async getSpecies(params: {
    name?: string;
    scientificName?: string;
    alpha3?: string;
    skip?: number;
    take?: number;
    cursor?: Prisma.sSpeciesWhereUniqueInput;
    orderBy?: any;
  }): Promise<sSpecies[]> {
    try {
      return await this.speciesRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          taxonomyCode: true,
          name: true,
          mId: true,
          scientificName: true,
          alpha3: true,
        },
        where: {
          name: params.name || undefined,
          scientificName: params.scientificName || undefined,
          alpha3: params.alpha3 || undefined,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchSpeciesPayload): Promise<any> {
    try {
      return await this.speciesRepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          taxonomyCode: true,
          name: true,
          mId: true,
          scientificName: true,
          alpha3: true,
          createdAt: true,
          updatedAt: true,
        },
        include: params.include
          ? {
              harvests: true,
              fisheries: true,
            }
          : undefined,
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetailSpecies(id?: string | bigint): Promise<sSpecies> {
    try {
      return await this.speciesRepository.first(id);
    } catch (err) {
      throw err;
    }
  }

  async getTariffBySpecies(id?: string | bigint): Promise<any> {
    try {
      const speciesData = await this.speciesRepository.instance().findFirst({
        where: {
          id: BigInt(id),
        },
        include: {
          sSpeciesTariff: {
            include: {
              tariff: true,
            },
          },
        },
      });
      if (!speciesData || !speciesData.id) {
        throw new BadRequestException('Not Found Species Record!');
      }
      const tariffs: any = [];
      for (const datum of speciesData.sSpeciesTariff) {
        tariffs.push(datum.tariff);
      }

      delete speciesData.sSpeciesTariff;

      return {
        ...speciesData,
        tariffs,
      };
    } catch (err) {
      throw err;
    }
  }
}
