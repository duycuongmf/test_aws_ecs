import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GeneratorHelper } from '../../../shared/helpers/generator.helper';
import { AuthAbilityFactory } from '../../auth/casl/auth.ability.factory';
import { ContactType, Status, User } from '@prisma/client';
import { PERMISSIONS } from '../../auth/casl/action.enum';
import { RESPONSE_MESSAGE } from '../../../constants/response-message';
import { CreateOrganizationPayload } from '../payload/create-organization.payload';
import { OrganizationPrismaRepository } from '../organization.prisma.repository';
import { PrismaService } from '../../../shared/services/prisma.service';
import { subject } from '@casl/ability';
import { UpdateOrganizationPayload } from '../payload/update-organization.payload';
import { DeleteOrganizationPayload } from '../payload/delete-organization.payload';
import { RoleTypeNew } from '../../../constants';
import * as moment from 'moment';
import { GetAllOrganizationPayload } from '../payload/get-all-organization.payload';
import { UpdateRoleOrganizationPayload } from '../payload/update-role-organization.payload';
import { CreateUserOrganizationPayload } from '../payload/create-user-organization.payload';
import { UserService } from '../../user/user.service';

@Injectable()
export class OrganizationService {
  constructor(
    private generatorHelper: GeneratorHelper,
    private prismaService: PrismaService,
    private userService: UserService,
    @Inject('OrganizationRepository')
    private organizationPrismaRepository: OrganizationPrismaRepository,
    private authAbilityFactory: AuthAbilityFactory
  ) {}

  async getDetail(id?: string | bigint, user?: User): Promise<any> {
    try {
      if (!user || !user.id) {
        throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
      }

      const _organization: any = await this.organizationPrismaRepository.first(
        id,
        {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isVerified: true,
            creator: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
          where: {
            id: BigInt(id),
            deletedAt: null,
          },
        }
      );

      if (!_organization || !_organization.id || _organization.deletedAt) {
        throw new NotFoundException(RESPONSE_MESSAGE.organizations.notFound);
      }

      const ability = await this.authAbilityFactory.forUser(user);
      if (
        ability.cannot(PERMISSIONS.READ, subject('Organization', _organization))
      ) {
        throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
      }

      return _organization;
    } catch (err) {
      throw err;
    }
  }

  async getWithPaginate(
    params: GetAllOrganizationPayload,
    user: User
  ): Promise<any> {
    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.READ, 'Organization')) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      // Get list organization for user joined
      const grants = await this.prismaService.grant.findMany({
        where: { userId: BigInt(user.id) },
      });
      const organization_ids = grants.map(
        (organization) => organization.organizationId
      );

      return await this.organizationPrismaRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          isVerified: true,
          creator: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        where: {
          // creatorId: user.id,
          id: { in: organization_ids },
          deletedAt: null,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async create(
    user: User,
    createOrganizationPayload: CreateOrganizationPayload
  ): Promise<any> {
    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.CREATE, 'Organization')) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      const _organization = await this.prismaService.organization.findFirst({
        where: {
          creatorId: BigInt(user.id),
          name: createOrganizationPayload.name,
        },
      });

      if (_organization && _organization.id) {
        throw new BadRequestException(RESPONSE_MESSAGE.organizations.existed);
      }

      const organization = await this.prismaService.organization.create({
        data: {
          id: this.generatorHelper.generateSnowflakeId(),
          creatorId: BigInt(user.id),
          name: createOrganizationPayload.name,
          phone: createOrganizationPayload.phone,
          email: createOrganizationPayload.email,
          address: createOrganizationPayload.address,
          status: Status.ACTIVE,
        },
      });

      const role = await this.prismaService.role.findFirst({
        where: { name: RoleTypeNew.ADMINISTRATOR },
      });

      await this.prismaService.grant.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          roleId: role.id,
          isDefault: true,
          creatorId: user.id,
        },
      });

      return organization;
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async update(
    user: User,
    id: bigint,
    updateOrganizationPayload: UpdateOrganizationPayload
  ): Promise<any> {
    const _organization = await this.organizationPrismaRepository.first(id);
    if (
      !_organization ||
      !_organization.id ||
      _organization.deletedAt != null
    ) {
      throw new ForbiddenException(RESPONSE_MESSAGE.organizations.notFound);
    }

    const ability = await this.authAbilityFactory.forUser(user);
    if (
      ability.cannot(PERMISSIONS.UPDATE, subject('Organization', _organization))
    ) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      return await this.prismaService.organization.update({
        where: {
          id: BigInt(id),
        },
        data: {
          name: this.generatorHelper.checkEmpty(
            _organization,
            updateOrganizationPayload,
            'name'
          ),
          email: this.generatorHelper.checkEmpty(
            _organization,
            updateOrganizationPayload,
            'email'
          ),
          phone: this.generatorHelper.checkEmpty(
            _organization,
            updateOrganizationPayload,
            'phone'
          ),
          address: this.generatorHelper.checkEmpty(
            _organization,
            updateOrganizationPayload,
            'address'
          ),
        },
      });
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async updateRole(
    user: User,
    id: bigint,
    updateRoleOrganizationPayload: UpdateRoleOrganizationPayload
  ): Promise<any> {
    const _organization = await this.organizationPrismaRepository.first(id);
    if (
      !_organization ||
      !_organization.id ||
      _organization.deletedAt != null
    ) {
      throw new ForbiddenException(RESPONSE_MESSAGE.organizations.notFound);
    }

    const ability = await this.authAbilityFactory.forUser(user);
    if (
      ability.cannot(PERMISSIONS.UPDATE, subject('Organization', _organization))
    ) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      return await this.prismaService.$transaction(async (tx) => {
        const user = await this.prismaService.user.findFirst({
          where: { id: BigInt(updateRoleOrganizationPayload.userId) },
        });

        if (!user || !user.id) {
          throw new BadRequestException(RESPONSE_MESSAGE.users.notFound);
        }

        const grant = await this.prismaService.grant.findFirst({
          where: {
            userId: BigInt(updateRoleOrganizationPayload.userId),
            organizationId: BigInt(id),
          },
        });

        if (grant && grant.isDefault) {
          throw new BadRequestException(RESPONSE_MESSAGE.grants.default);
        }

        if (grant || updateRoleOrganizationPayload.roleId === null) {
          await tx.grant.delete({
            where: {
              organizationId_userId: {
                organizationId: grant.organizationId,
                userId: grant.userId,
              },
            },
          });
        }

        if (
          this.generatorHelper.isBigInt(updateRoleOrganizationPayload.roleId)
        ) {
          const role = await this.prismaService.role.findFirst({
            where: { id: BigInt(updateRoleOrganizationPayload.roleId) },
          });

          if (!role || !role.id) {
            throw new BadRequestException(RESPONSE_MESSAGE.roles.notFound);
          }

          await tx.grant.create({
            data: {
              userId: user.id,
              organizationId: BigInt(id),
              roleId: role.id,
              isDefault: false,
              creatorId: user.id,
            },
          });
        }
        return true;
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async getRoles(user: User, id: bigint): Promise<any> {
    const ability = await this.authAbilityFactory.forUser(user);
    if (ability.cannot(PERMISSIONS.READ, 'Organization')) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      return await this.prismaService.grant.findMany({
        select: {
          userId: true,
          organizationId: true,
          organization: true,
          creator: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          roleId: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          userId: user.id,
          organizationId: BigInt(id),
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async delete(
    user: User,
    deleteOrganizationPayload: DeleteOrganizationPayload
  ): Promise<boolean> {
    const organization = await this.organizationPrismaRepository.first(
      deleteOrganizationPayload.id
    );
    if (!organization) {
      throw new ForbiddenException(RESPONSE_MESSAGE.organizations.notFound);
    }

    const ability = await this.authAbilityFactory.forUser(user);
    if (
      ability.cannot(PERMISSIONS.DELETE, subject('Organization', organization))
    ) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      await this.prismaService.grant.deleteMany({
        where: {
          organizationId: BigInt(deleteOrganizationPayload.id),
        },
      });
      await this.prismaService.organization.update({
        data: {
          deletedAt: moment().utc().toDate(),
        },
        where: {
          id: organization.id,
        },
      });

      return true;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async createUser(
    user: User,
    id: bigint,
    createUserOrganizationPayload: CreateUserOrganizationPayload
  ): Promise<any> {
    const organization = await this.organizationPrismaRepository.first(id);
    if (!organization) {
      throw new ForbiddenException(RESPONSE_MESSAGE.organizations.notFound);
    }

    const ability = await this.authAbilityFactory.forUser(user);
    if (
      ability.cannot(PERMISSIONS.UPDATE, subject('Organization', organization))
    ) {
      throw new ForbiddenException(RESPONSE_MESSAGE.auth.accessDenied);
    }

    try {
      return await this.prismaService.$transaction(async (tx) => {
        let checkUser = await tx.user.findUnique({
          where: { email: createUserOrganizationPayload.email },
        });
        if (!checkUser) {
          const hashPassword = this.userService.createHash(
            createUserOrganizationPayload.password
          );
          const newUser = {} as User;
          newUser.id = this.generatorHelper.generateSnowflakeId();
          newUser.email = createUserOrganizationPayload.email;
          newUser.password = hashPassword;
          newUser.organizationId = BigInt(id);
          const user = await tx.user.create({ data: newUser });
          const _organization = await tx.organization.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              name: 'default',
              status: Status.ACTIVE,
              creatorId: user.id,
            },
          });
          const roleDefault = await tx.role.findFirst({
            where: { name: RoleTypeNew.ADMINISTRATOR },
          });

          await tx.grant.create({
            data: {
              userId: user.id,
              organizationId: BigInt(_organization.id),
              roleId: roleDefault.id,
              isDefault: true,
              creatorId: user.id,
            },
          });

          checkUser = newUser;
        }

        const grant = await this.prismaService.grant.findFirst({
          where: {
            userId: BigInt(checkUser.id),
            organizationId: BigInt(id),
          },
        });

        if (grant && grant.isDefault) {
          throw new BadRequestException(RESPONSE_MESSAGE.grants.default);
        }

        if (grant || createUserOrganizationPayload.roleId === null) {
          await tx.grant.delete({
            where: {
              organizationId_userId: {
                organizationId: grant.organizationId,
                userId: grant.userId,
              },
            },
          });
        }

        if (
          this.generatorHelper.isBigInt(createUserOrganizationPayload.roleId)
        ) {
          const role = await this.prismaService.role.findFirst({
            where: { id: BigInt(createUserOrganizationPayload.roleId) },
          });

          if (!role || !role.id) {
            throw new BadRequestException(RESPONSE_MESSAGE.roles.notFound);
          }

          await tx.grant.create({
            data: {
              userId: user.id,
              organizationId: BigInt(id),
              roleId: role.id,
              isDefault: false,
              creatorId: user.id,
            },
          });
        }

        user.organizationId = organization.id;
        delete user.password;
        return user;
      });
    } catch (err) {
      throw err;
    }
  }
}
