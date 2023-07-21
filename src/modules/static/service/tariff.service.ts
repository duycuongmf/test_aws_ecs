import { Inject, Injectable } from '@nestjs/common';
import { sTariff } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { GetAllTariffPayload } from '../payload/tariff/get-all-tariff.payload';
import { SearchTariffPayload } from '../payload/tariff/search-tariff.payload';

@Injectable()
export class TariffService {
  constructor(
    @Inject('TariffRepository')
    private readonly tariffRepository: RepositoryInterface<sTariff>
  ) {}

  async getWithPaginate(params: GetAllTariffPayload): Promise<any> {
    try {
      return await this.tariffRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          footnotes: true,
          quotaQuantity: true,
          other: true,
          indent: true,
          superior: true,
          chapter: true,
          heading: true,
          chapterHeading: true,
          subheading: true,
          tariffRate: true,
          statisticalSuffix: true,
          fullNonDelimited: true,
          fullDelimited: true,
          description: true,
          fullDescription: true,
          special: true,
          htsno: true,
          units: true,
          general: true,
          harvests: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          description: params.description || undefined,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchTariffPayload): Promise<any> {
    try {
      return await this.tariffRepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          footnotes: true,
          quotaQuantity: true,
          other: true,
          indent: true,
          superior: true,
          chapter: true,
          heading: true,
          chapterHeading: true,
          subheading: true,
          tariffRate: true,
          statisticalSuffix: true,
          fullNonDelimited: true,
          fullDelimited: true,
          description: true,
          fullDescription: true,
          special: true,
          htsno: true,
          units: true,
          general: true,
          harvests: true,
          createdAt: true,
          updatedAt: true,
        },
        include: params.include
          ? {
              harvests: true,
            }
          : undefined,
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetail(id?: string | bigint): Promise<sTariff> {
    try {
      return await this.tariffRepository.first(id);
    } catch (err) {
      throw err;
    }
  }
}
