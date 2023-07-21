import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { Prisma, sRFMO } from '@prisma/client';
import {
  PaginationInterface,
  RepositoryInterface,
} from '../../../../shared/repository/repository.interface';
import { GeneratorHelper } from '../../../../shared/helpers/generator.helper';

@Injectable()
export class RFMOPrismaRepository implements RepositoryInterface<sRFMO> {
  constructor(
    private prisma: PrismaService,
    private generatorHelper: GeneratorHelper
  ) {}

  instance(): Prisma.sRFMODelegate<
    'rejectOnNotFound' extends keyof Prisma.PrismaClientOptions
      ? Prisma.PrismaClientOptions['rejectOnNotFound']
      : false
  > {
    try {
      return this.prisma.sRFMO;
    } catch (err) {
      throw err;
    }
  }

  async count(countCondition: Prisma.sRFMOCountArgs): Promise<any> {
    try {
      return this.prisma.sRFMO.count(countCondition);
    } catch (err) {
      throw err;
    }
  }

  async all(select: Prisma.sRFMOSelect): Promise<any> {
    try {
      return this.prisma.sRFMO.findMany({
        select,
      });
    } catch (err) {
      throw err;
    }
  }

  async first(id: string | bigint): Promise<sRFMO> {
    try {
      if (typeof id === 'string') id = BigInt(id);
      return this.prisma.sRFMO.findFirst({ where: { id } });
    } catch (err) {
      throw err;
    }
  }

  async paginate(params: {
    skip?: number;
    take?: number;
    select?: Prisma.sRFMOSelect;
    where?: Prisma.sRFMOWhereInput;
  }): Promise<any> {
    try {
      const { skip, take, select, where } = params;
      return this.prisma.sRFMO.findMany({
        skip: skip || 0,
        take: take || 100,
        select,
        where,
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
    select?: Prisma.sRFMOSelect;
    // where?: Prisma.sRFMOWhereInput;
    include?: Prisma.sRFMOInclude;
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
          ...{ include: include, take: take >= 50 ? 50 : take },
        };
      }

      const [total, data] = await Promise.all([
        this.count({
          where: queryWhereCountSearchPattern,
        }),
        this.prisma.sRFMO.findMany(queryObject),
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
    select?: Prisma.sRFMOSelect;
    where?: Prisma.sRFMOWhereInput;
  }): Promise<any> {
    try {
      const { select, where } = params;
      return this.prisma.sRFMO.findMany({
        select,
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async create(data: Prisma.sRFMOCreateInput): Promise<sRFMO> {
    try {
      return await this.prisma.sRFMO.create({
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async createMany(
    data: Prisma.sRFMOCreateManyInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.sRFMO.createMany({
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async update(
    include: Prisma.sRFMOInclude,
    where: Prisma.sRFMOWhereUniqueInput,
    data: Prisma.sRFMOUpdateInput
  ): Promise<any> {
    try {
      return await this.prisma.sRFMO.update({
        where,
        data,
        include,
      });
    } catch (err) {
      throw err;
    }
  }

  async updateMany(
    where: Prisma.sRFMOWhereUniqueInput,
    data: Prisma.sRFMOUpdateInput
  ): Promise<any> {
    try {
      return await this.prisma.sRFMO.updateMany({
        where,
        data,
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(where: Prisma.sRFMOWhereUniqueInput): Promise<sRFMO> {
    try {
      return await this.prisma.sRFMO.delete({
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteMany(
    where: Prisma.sRFMOWhereUniqueInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.sRFMO.deleteMany({
        where,
      });
    } catch (err) {
      throw err;
    }
  }
}
