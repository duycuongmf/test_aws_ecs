import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { Organization, Prisma } from '@prisma/client';
import {
  PaginationInterface,
  RepositoryInterface,
} from '../../shared/repository/repository.interface';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';

@Injectable()
export class OrganizationPrismaRepository
  implements RepositoryInterface<Organization>
{
  constructor(
    private prisma: PrismaService,
    private generatorHelper: GeneratorHelper
  ) {}

  instance(): Prisma.OrganizationDelegate<
    'rejectOnNotFound' extends keyof Prisma.PrismaClientOptions
      ? Prisma.PrismaClientOptions['rejectOnNotFound']
      : false
  > {
    try {
      return this.prisma.organization;
    } catch (err) {
      throw err;
    }
  }

  async count(countCondition: Prisma.OrganizationCountArgs): Promise<any> {
    try {
      return this.prisma.organization.count(countCondition);
    } catch (err) {
      throw err;
    }
  }

  async aggregate(aggregateCondition: object): Promise<any> {
    try {
      return this.prisma.organization.aggregate(aggregateCondition);
    } catch (err) {
      throw err;
    }
  }

  async all(select: Prisma.OrganizationSelect): Promise<any> {
    try {
      return this.prisma.organization.findMany({
        select,
      });
    } catch (err) {
      throw err;
    }
  }

  async first(id: string | bigint, options?: object): Promise<Organization> {
    try {
      if (typeof id === 'string') id = BigInt(id);
      return this.prisma.organization.findFirst({ where: { id }, ...options });
    } catch (err) {
      throw err;
    }
  }

  async paginate(params: {
    skip?: number;
    take?: number;
    select?: Prisma.OrganizationSelect;
    where?: Prisma.OrganizationWhereInput;
    include?: Prisma.OrganizationInclude;
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
        this.prisma.organization.findMany(query),
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
    select?: Prisma.OrganizationSelect;
    where?: Prisma.OrganizationWhereInput;
    include?: Prisma.OrganizationInclude;
    relationIds?: string[];
  }): Promise<any> {
    try {
      const {
        skip = 0,
        take = 100,
        type = 'fuzzy',
        fields,
        query = null,
        where = {},
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
        where: { ...querySearchPattern, ...where },
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
          where: { ...queryWhereCountSearchPattern, ...where },
        }),
        this.prisma.organization.findMany(queryObject),
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
    select?: Prisma.OrganizationSelect;
    where?: Prisma.OrganizationWhereInput;
  }): Promise<any> {
    try {
      const { select, where } = params;
      return this.prisma.organization.findMany({
        select,
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    try {
      return await this.prisma.organization.create({
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async createMany(
    data: Prisma.OrganizationCreateManyInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.organization.createMany({
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async update(params: {
    where: Prisma.OrganizationWhereUniqueInput;
    data: Prisma.OrganizationUpdateInput;
  }): Promise<any> {
    try {
      return await this.prisma.organization.update({
        where: params.where,
        data: params.data,
      });
    } catch (err) {
      throw err;
    }
  }

  async updateMany(params: {
    where: Prisma.OrganizationWhereUniqueInput;
    data: Prisma.OrganizationUpdateInput;
  }): Promise<any> {
    try {
      return await this.prisma.organization.updateMany({
        where: params.where,
        data: params.data,
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(
    where: Prisma.OrganizationWhereUniqueInput
  ): Promise<Organization> {
    try {
      return await this.prisma.organization.delete({
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteMany(
    where: Prisma.OrganizationWhereInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.organization.deleteMany({
        where,
      });
    } catch (err) {
      throw err;
    }
  }
}
