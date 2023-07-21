import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Import, User } from '@prisma/client';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { ImportPrismaRepository } from './import.prisma.repository';
import { CreateImportPayload } from './payload/create-import.payload';
import { RESPONSE_MESSAGE } from '../../constants/response-message';
import { DeleteImportPayload } from './payload/delete-import.payload';
import { UpdateImportPayload } from './payload/update-import.payload';
import { SearchImportPayload } from './payload/search-import.payload';
import { GetAllImportPayload } from './payload/get-all-import.payload';
import { PERMISSIONS } from '../auth/casl/action.enum';
import { subject } from '@casl/ability';
import { AuthAbilityFactory } from '../auth/casl/auth.ability.factory';

@Injectable()
export class ImportService {
  constructor(
    private generatorHelper: GeneratorHelper,
    @Inject('ImportRepository')
    private importPrisma: ImportPrismaRepository,
    private authAbilityFactory: AuthAbilityFactory
  ) {}

  async getWithPaginate(params: GetAllImportPayload): Promise<any> {
    try {
      return await this.importPrisma.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          exportFromId: true,
          importToId: true,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchImportPayload, user): Promise<any> {
    try {
      const ability = await this.authAbilityFactory.forUser(user);
      if (ability.cannot(PERMISSIONS.READ, 'Import')) {
        throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
      }

      return await this.importPrisma.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          exportFromId: true,
          importToId: true,
          creatorId: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          organizationId: user.organizationId,
        },
        include: params.include
          ? {
              exportFrom: true,
              importTo: true,
              creator: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
              organization: true,
            }
          : undefined,
        relationIds: [
          'exportFromId',
          'importToId',
          'organizationId',
          'creatorId',
        ],
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetail(user: User, id?: string | bigint): Promise<Import> {
    try {
      const _import = await this.importPrisma.first(id, {
        include: {
          exportFrom: true,
          importTo: true,
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          organization: true,
        },
      });

      if (!_import || !_import.id) {
        throw new NotFoundException(RESPONSE_MESSAGE.imports.notFound);
      }

      const ability = await this.authAbilityFactory.forUser(user);
      if (ability.cannot(PERMISSIONS.READ, subject('Import', _import))) {
        throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
      }

      return _import;
    } catch (err) {
      throw err;
    }
  }

  async create(
    user: User,
    createImportPayload: CreateImportPayload
  ): Promise<any> {
    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.CREATE, 'Import')) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      // const existImport = await this.importPrisma.count({
      //   where: {
      //     importToId: BigInt(createImportPayload.importToId),
      //     exportFromId: BigInt(createImportPayload.exportFromId),
      //   },
      // });
      // if (!existImport) {
      //
      // } else {
      //   throw new BadRequestException(RESPONSE_MESSAGE.imports.importExisted);
      // }

      return await this.importPrisma.create({
        id: this.generatorHelper.generateSnowflakeId(),
        exportFrom: {
          connect: { id: BigInt(createImportPayload.exportFromId) },
        },
        importTo: {
          connect: { id: BigInt(createImportPayload.importToId) },
        },
        creator: {
          connect: { id: user.id },
        },
        organization: {
          connect: { id: user.organizationId },
        },
      });
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async update(
    user: User,
    id: bigint,
    updateImportPayload: UpdateImportPayload
  ): Promise<any> {
    const _import = await this.importPrisma.first(id);

    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.UPDATE, subject('Import', _import))) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      return await this.importPrisma.update({
        data: {
          exportFrom: {
            connect: { id: BigInt(updateImportPayload.exportFromId) },
          },
          importTo: {
            connect: { id: BigInt(updateImportPayload.importToId) },
          },
        },
        where: {
          id: BigInt(id),
        },
      });
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async delete(
    user: User,
    deleteImportPayload: DeleteImportPayload
  ): Promise<boolean> {
    //HoangHN - Verify end-user had enough permission
    const _import = await this.importPrisma.first(deleteImportPayload.id);
    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.DELETE, subject('Import', _import))) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      const _delete = await this.importPrisma.deleteMany({
        id: BigInt(deleteImportPayload.id),
        creatorId: user.id,
      });

      return _delete.count === 1;
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }
}
