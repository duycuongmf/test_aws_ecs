import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GeneratorHelper } from '../helpers/generator.helper';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // super({
    //   log: [
    //     {
    //       emit: 'event',
    //       level: 'query',
    //     },
    //   ],
    // });
    super();
  }

  async onModuleInit() {
    await this.$connect();

    // HoangHN - Hook log query
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // this.$on('query', async (e) => {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   console.log(`${e.query} ${e.params}`);
    // });

    //HoangHN - Hook inject SnowFlakeId to insert
    // this.$use(async (params, next) => {
    //   //HoangHN - Before create
    //   if (params.action === 'create') {
    //     if (params.args.data.id === undefined) {
    //       params.args.data.id = BigInt(
    //         this.generatorHelper.generateSnowflakeId()
    //       );
    //     }
    //   }
    //
    //   //HoangHN - do action
    //   const result = await next(params);
    //
    //   //HoangHn - After create transform to string.
    //   if (Array.isArray(result)) {
    //     return result.map((row) => {
    //       if (row.id) {
    //         row.id = row.id.toString();
    //       }
    //       return row;
    //     });
    //   } else {
    //     if (result && result.id) {
    //       result.id = result.id.toString();
    //     }
    //     return result;
    //   }
    // });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
