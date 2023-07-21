import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { Prisma, Document } from '@prisma/client';
import {
  PaginationInterface,
  RepositoryInterface,
} from '../../shared/repository/repository.interface';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';

@Injectable()
export class DocumentPrismaRepository implements RepositoryInterface<Document> {
  constructor(
    private prisma: PrismaService,
    private generatorHelper: GeneratorHelper
  ) {}

  instance(): Prisma.DocumentDelegate<
    'rejectOnNotFound' extends keyof Prisma.PrismaClientOptions
      ? Prisma.PrismaClientOptions['rejectOnNotFound']
      : false
  > {
    try {
      return this.prisma.document;
    } catch (err) {
      throw err;
    }
  }

  async count(countCondition: Prisma.DocumentCountArgs): Promise<any> {
    try {
      return this.prisma.document.count(countCondition);
    } catch (err) {
      throw err;
    }
  }

  async aggregate(aggregateCondition: object): Promise<any> {
    try {
      return this.prisma.document.aggregate(aggregateCondition);
    } catch (err) {
      throw err;
    }
  }

  async all(select: Prisma.DocumentSelect): Promise<any> {
    try {
      return this.prisma.document.findMany({
        select,
      });
    } catch (err) {
      throw err;
    }
  }

  async first(id: string | bigint, options?: object): Promise<Document> {
    try {
      if (typeof id === 'string') id = BigInt(id);
      return this.prisma.document.findFirst({ where: { id }, ...options });
    } catch (err) {
      throw err;
    }
  }

  async paginate(params: {
    skip?: number;
    take?: number;
    select?: Prisma.DocumentSelect;
    where?: Prisma.DocumentWhereInput;
    include?: Prisma.DocumentInclude;
  }): Promise<any> {
    try {
      const { skip = 0, take = 100, select, where, include } = params;
      let query = {
        skip: skip,
        take: take,
        where,
        select,
      };
      if (include) {
        delete query.select;
        query = {
          ...query,
          ...{ include: include, take: 50 },
        };
      }
      const [total, data] = await Promise.all([
        this.count({ where: query.where }),
        this.prisma.document.findMany(query),
      ]);

      return new PaginationInterface<any>(data, {
        total,
        skip,
        take: take,
        prev: skip > take ? true : null,
        next: skip + take < total ? true : null,
      });
    } catch (err) {
      throw err;
    }
  }

  async search(params: {
    type?: string;
    fields?: string;
    query?: string;
    skip?: number;
    take?: number;
    select?: Prisma.DocumentSelect;
    // where?: Prisma.DocumentWhereInput;
    include?: Prisma.DocumentInclude;
    relationIds?: string[];
  }): Promise<any> {
    try {
      const {
        skip = 0,
        take = 100,
        type = 'fuzzy',
        fields,
        query = null,
        select,
        // where,
        include,
        relationIds = [],
      } = params;

      const queryWhereCount = [];
      const queryWhereSearch = [];
      const _fields = fields != '' && fields != null ? fields.split(',') : [];

      if (_fields.length > 0) {
        for (const field of _fields) {
          if (select[field] && query != null && query != '') {
            const matchSearch =
              type !== null && type !== '' && type === 'match'
                ? query
                : {
                    contains: query,
                    mode:
                      type !== null && type !== '' && type === 'fuzzy'
                        ? 'insensitive'
                        : undefined,
                  };

            const directQuery =
              relationIds.includes(field) &&
              this.generatorHelper.isBigInt(query)
                ? BigInt(query)
                : matchSearch;
            const initObject: any = {
              [field]: directQuery,
            };
            queryWhereCount.push(initObject);
            queryWhereSearch.push(initObject);
          }
        }
      }
      let querySearchPattern = undefined;
      let queryWhereCountSearchPattern = undefined;

      if (queryWhereSearch.length > 0 && query != null) {
        querySearchPattern = {
          AND: queryWhereSearch,
        };

        queryWhereCountSearchPattern = {
          AND: queryWhereCount,
        };

        if (type === 'fuzzy') {
          querySearchPattern['OR'] = queryWhereSearch;
          queryWhereCountSearchPattern['OR'] = queryWhereCount;
          delete querySearchPattern['AND'];
          delete queryWhereCountSearchPattern['AND'];
        }
      }

      let queryObject = {
        skip: skip,
        take: take,
        where: querySearchPattern,
        select,
      };
      if (include) {
        delete queryObject.select;
        queryObject = {
          ...queryObject,
          ...{ include: include, take: 50 },
        };
      }

      const [total, data] = await Promise.all([
        this.count({
          where: queryWhereCountSearchPattern,
        }),
        this.prisma.document.findMany(queryObject),
      ]);

      return new PaginationInterface<any>(data, {
        total,
        skip,
        take: queryObject.take,
        prev: skip > take ? true : null,
        next: skip + take < total ? true : null,
      });
    } catch (err) {
      throw err;
    }
  }

  async findByField(params: {
    select?: Prisma.DocumentSelect;
    where?: Prisma.DocumentWhereInput;
  }): Promise<any> {
    try {
      const { select, where } = params;
      return this.prisma.document.findMany({
        select,
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async create(data: Prisma.DocumentCreateInput): Promise<Document> {
    try {
      return await this.prisma.document.create({
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async createMany(
    data: Prisma.DocumentCreateManyInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.document.createMany({
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async update(params: {
    where: Prisma.DocumentWhereUniqueInput;
    data: Prisma.DocumentUpdateInput;
  }): Promise<any> {
    try {
      return await this.prisma.document.update({
        where: params.where,
        data: params.data,
      });
    } catch (err) {
      throw err;
    }
  }

  async updateMany(params: {
    where: Prisma.DocumentWhereUniqueInput;
    data: Prisma.DocumentUpdateInput;
  }): Promise<any> {
    try {
      return await this.prisma.document.updateMany({
        where: params.where,
        data: params.data,
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(where: Prisma.DocumentWhereUniqueInput): Promise<Document> {
    try {
      return await this.prisma.document.delete({
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteMany(
    where: Prisma.DocumentWhereInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.document.deleteMany({
        where,
      });
    } catch (err) {
      throw err;
    }
  }
}
