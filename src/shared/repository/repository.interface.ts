import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../../common/dto/page-meta.dto';

export class PaginationInterface<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}

export interface RepositoryInterface<T> {
  //     instance(): Prisma.sCountryDelegate<
  //         'rejectOnNotFound' extends keyof Prisma.PrismaClientOptions
  //             ? Prisma.PrismaClientOptions['rejectOnNotFound']
  //             : false
  //     > {
  //     try {
  //         return this.prisma.sCountry;
  //     } catch (err) {
  //         throw err;
  //     }
  // }

  count(params: object): Promise<number>;

  all(select: object): Promise<T[]>;

  first(id: string | bigint, options?: object): Promise<T>;

  paginate(params: object): Promise<T[]>;

  search(params: object): Promise<T[]>;

  findByField(params: object): Promise<T>;

  create(data: object): Promise<T>;

  createMany(data: object): Promise<any>;

  update(include: object, where: object, data: object): Promise<any>;

  updateMany(where: any, data: any): Promise<any>;

  delete(where: object): Promise<T>;

  deleteMany(where: object): Promise<any>;
}
