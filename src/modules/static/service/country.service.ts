import { Inject, Injectable } from '@nestjs/common';
import { sCountry } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { SearchCountryPayload } from '../payload/country/search-country.payload';

@Injectable()
export class CountryService {
  constructor(
    @Inject('CountryRepository')
    private readonly countryRepository: RepositoryInterface<sCountry>
  ) {}

  async getCountries(params: SearchCountryPayload): Promise<any> {
    try {
      return await this.countryRepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          name: true,
          mId: true,
          mid: true,
          alpha2: true,
          alpha3: true,
          sort: true,
          createdAt: true,
          updatedAt: true,
        },
        sort: [
          {
            sort: 'desc',
          },
          {
            name: 'asc',
          },
        ],
        include: params.include
          ? {
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
              imports: true,
              exports: true,
              fisheries: true,
              vessels: true,
            }
          : undefined,
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetailCountry(id?: string | bigint): Promise<sCountry> {
    try {
      return await this.countryRepository.first(id);
    } catch (err) {
      throw err;
    }
  }

  async getByRelated(params: { rfmoId?: bigint }): Promise<sCountry[]> {
    try {
      return await this.countryRepository.paginate({
        take: 100,
        select: {
          id: true,
          name: true,
          mId: true,
          mid: true,
          alpha2: true,
          alpha3: true,
          sort: true,
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
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
