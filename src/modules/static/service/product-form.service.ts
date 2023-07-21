import { Inject, Injectable } from '@nestjs/common';
import { sProductForm } from '@prisma/client';
import { RepositoryInterface } from '../../../shared/repository/repository.interface';
import { GetAllProductFormPayload } from '../payload/product-form/get-all-product-form.payload';
import { SearchProductFormPayload } from '../payload/product-form/search-product-form.payload';

@Injectable()
export class ProductFormService {
  constructor(
    @Inject('ProductFormRepository')
    private readonly productFormRepository: RepositoryInterface<sProductForm>
  ) {}

  async getWithPaginate(params: GetAllProductFormPayload): Promise<any> {
    try {
      return await this.productFormRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          code: true,
          name: true,
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

  async searchWithPaginate(params: SearchProductFormPayload): Promise<any> {
    try {
      return await this.productFormRepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          code: true,
          name: true,
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

  async getDetail(id?: string | bigint): Promise<sProductForm> {
    try {
      return await this.productFormRepository.first(id);
    } catch (err) {
      throw err;
    }
  }
}
