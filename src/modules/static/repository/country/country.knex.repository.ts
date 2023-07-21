import { Injectable } from '@nestjs/common';
import { RepositoryInterface } from '../../../../shared/repository/repository.interface';

// This file is example for multiple type of database. it works with Repository Layer
// Don't delete this file.

interface CountryModel {
  id: bigint;
  mId: string;
}

@Injectable()
export class CountryKnexRepository
  implements RepositoryInterface<CountryModel>
{
  constructor() {}

  async first(id: string | bigint): Promise<CountryModel> {
    try {
      if (typeof id === 'string') id = BigInt(id);
      return {
        id: BigInt(1010),
        mId: 'this is mId',
      };
    } catch (err) {
      throw err;
    }
  }

  async paginate(params: {
    skip?: number;
    take?: number;
    select?: object;
    where?: object;
  }): Promise<CountryModel[]> {
    try {
      return [
        {
          id: BigInt(1010),
          mId: 'this is mId 1',
        },
        {
          id: BigInt(1012),
          mId: 'this is mId 2',
        },
      ];
    } catch (err) {
      throw err;
    }
  }
  async search(params: {
    skip?: number;
    take?: number;
    select?: object;
    where?: object;
  }): Promise<CountryModel[]> {
    try {
      return [
        {
          id: BigInt(1010),
          mId: 'this is mId 1',
        },
        {
          id: BigInt(1012),
          mId: 'this is mId 2',
        },
      ];
    } catch (err) {
      throw err;
    }
  }

  all(select: object): Promise<any> {
    return Promise.resolve([select]);
  }

  count(): Promise<number> {
    return Promise.resolve(1);
  }

  create(data: object): Promise<CountryModel> {
    return Promise.resolve(undefined);
  }

  createMany(data: object): Promise<number> {
    return Promise.resolve(1);
  }

  delete(where: object): Promise<CountryModel> {
    return Promise.resolve(undefined);
  }

  deleteMany(where: object): Promise<number> {
    return Promise.resolve(1);
  }

  findByField(params: object): Promise<CountryModel> {
    return Promise.resolve(undefined);
  }

  update(include: object, where: object, data: object): Promise<any> {
    return Promise.resolve(undefined);
  }

  updateMany(where: any, data: any): Promise<any> {
    return Promise.resolve(undefined);
  }
}
