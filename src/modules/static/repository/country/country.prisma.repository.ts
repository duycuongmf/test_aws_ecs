import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { sCountry, Prisma } from '@prisma/client';
import {
  PaginationInterface,
  RepositoryInterface,
} from '../../../../shared/repository/repository.interface';
import { GeneratorHelper } from '../../../../shared/helpers/generator.helper';

@Injectable()
export class CountryPrismaRepository implements RepositoryInterface<sCountry> {
  constructor(
    private prisma: PrismaService,
    private generatorHelper: GeneratorHelper
  ) {}

  instance(): Prisma.sCountryDelegate<
    'rejectOnNotFound' extends keyof Prisma.PrismaClientOptions
      ? Prisma.PrismaClientOptions['rejectOnNotFound']
      : false
  > {
    try {
      return this.prisma.sCountry;
    } catch (err) {
      throw err;
    }
  }

  async count(countCondition: Prisma.sCountryCountArgs): Promise<any> {
    try {
      return this.prisma.sCountry.count(countCondition);
    } catch (err) {
      throw err;
    }
  }

  async all(select: Prisma.sCountrySelect): Promise<any> {
    try {
      return this.prisma.sCountry.findMany({
        select,
      });
    } catch (err) {
      throw err;
    }
  }

  async first(id: string | bigint): Promise<sCountry> {
    try {
      if (typeof id === 'string') id = BigInt(id);
      return this.prisma.sCountry.findFirst({ where: { id } });
    } catch (err) {
      throw err;
    }
  }

  async paginate(params: {
    skip?: number;
    take?: number;
    select?: Prisma.sCountrySelect;
    where?: Prisma.sCountryWhereInput;
    include?: Prisma.sCountryInclude;
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
          ...{ include: include },
        };
      }

      const [total, data] = await Promise.all([
        this.count({ where: query.where }),
        this.prisma.sCountry.findMany(query),
      ]);

      return new PaginationInterface<any>(data, {
        total,
        skip,
        take,
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
    sort?: object[];
    select?: Prisma.sCountrySelect;
    // where?: Prisma.sCountryWhereInput;
    include?: Prisma.sCountryInclude;
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
        sort = undefined,
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
        orderBy: sort,
        select,
      };
      if (include) {
        delete queryObject.select;
        queryObject = {
          ...queryObject,
          ...{ include: include, take: take >= 50 ? 50 : take },
        };
      }

      const [total, data] = await Promise.all([
        this.count({
          where: queryWhereCountSearchPattern,
        }),
        this.prisma.sCountry.findMany(queryObject),
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
    select?: Prisma.sCountrySelect;
    where?: Prisma.sCountryWhereInput;
  }): Promise<any> {
    try {
      const { select, where } = params;
      return this.prisma.sCountry.findMany({
        select,
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async create(data: Prisma.sCountryCreateInput): Promise<sCountry> {
    try {
      return await this.prisma.sCountry.create({
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async createMany(
    data: Prisma.sCountryCreateManyInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.sCountry.createMany({
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async update(
    include: Prisma.sCountryInclude,
    where: Prisma.sCountryWhereUniqueInput,
    data: Prisma.sCountryUpdateInput
  ): Promise<any> {
    try {
      return await this.prisma.sCountry.update({
        where,
        data,
        include,
      });
    } catch (err) {
      throw err;
    }
  }

  async updateMany(
    where: Prisma.sCountryWhereUniqueInput,
    data: Prisma.sCountryUpdateInput
  ): Promise<any> {
    try {
      return await this.prisma.sCountry.updateMany({
        where,
        data,
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(where: Prisma.sCountryWhereUniqueInput): Promise<sCountry> {
    try {
      return await this.prisma.sCountry.delete({
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteMany(
    where: Prisma.sCountryWhereUniqueInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.sCountry.deleteMany({
        where,
      });
    } catch (err) {
      throw err;
    }
  }
}
