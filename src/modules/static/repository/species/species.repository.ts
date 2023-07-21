import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { sSpecies, Prisma } from '@prisma/client';
import { PaginationInterface } from '../../../../shared/repository/repository.interface';
import { GeneratorHelper } from '../../../../shared/helpers/generator.helper';

@Injectable()
export class SpeciesRepository {
  constructor(
    private prisma: PrismaService,
    private generatorHelper: GeneratorHelper
  ) {}

  instance(): Prisma.sSpeciesDelegate<
    'rejectOnNotFound' extends keyof Prisma.PrismaClientOptions
      ? Prisma.PrismaClientOptions['rejectOnNotFound']
      : false
  > {
    try {
      return this.prisma.sSpecies;
    } catch (err) {
      throw err;
    }
  }

  async count(countCondition: Prisma.sSpeciesCountArgs): Promise<any> {
    try {
      return this.prisma.sSpecies.count(countCondition);
    } catch (err) {
      throw err;
    }
  }

  async all(select: Prisma.sSpeciesSelect): Promise<any> {
    try {
      return this.prisma.sSpecies.findMany({
        select,
      });
    } catch (err) {
      throw err;
    }
  }

  async first(id: string | bigint): Promise<sSpecies> {
    try {
      if (typeof id === 'string') id = BigInt(id);
      return this.prisma.sSpecies.findFirst({ where: { id } });
    } catch (err) {
      throw err;
    }
  }

  async paginate(params: {
    skip?: number;
    take?: number;
    select?: Prisma.sSpeciesSelect;
    where?: Prisma.sSpeciesWhereInput;
  }): Promise<any> {
    try {
      const { skip, take, select, where } = params;
      return this.prisma.sSpecies.findMany({
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
    select?: Prisma.sSpeciesSelect;
    // where?: Prisma.sSpeciesWhereInput;
    include?: Prisma.sSpeciesInclude;
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
        this.prisma.sSpecies.findMany(queryObject),
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
    select?: Prisma.sSpeciesSelect;
    where?: Prisma.sSpeciesWhereInput;
  }): Promise<any> {
    try {
      const { select, where } = params;
      return this.prisma.sSpecies.findMany({
        select,
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async create(
    sSpeciesCreateInput: Prisma.sSpeciesCreateInput
  ): Promise<sSpecies> {
    try {
      return await this.prisma.sSpecies.create({
        data: sSpeciesCreateInput,
      });
    } catch (err) {
      throw err;
    }
  }

  async createMany(
    data: Prisma.sSpeciesCreateManyInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.sSpecies.createMany({
        data: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async update(
    include: Prisma.sSpeciesInclude,
    where: Prisma.sSpeciesWhereUniqueInput,
    data: Prisma.sSpeciesUpdateInput
  ): Promise<any> {
    try {
      return await this.prisma.sSpecies.update({
        where,
        data,
        include,
      });
    } catch (err) {
      throw err;
    }
  }

  async updateMany(
    where: Prisma.sSpeciesWhereUniqueInput,
    data: Prisma.sSpeciesUpdateInput
  ): Promise<any> {
    try {
      return await this.prisma.sSpecies.updateMany({
        where,
        data,
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(where: Prisma.sSpeciesWhereUniqueInput): Promise<sSpecies> {
    try {
      return await this.prisma.sSpecies.delete({
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteMany(
    where: Prisma.sSpeciesWhereUniqueInput
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prisma.sSpecies.deleteMany({
        where,
      });
    } catch (err) {
      throw err;
    }
  }
}
