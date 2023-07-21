import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { PrismaService } from '../../shared/services/prisma.service';
import { User, Status } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { TokenService } from '../auth/token.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { UpdateUserPayload } from './payload/search-catair.payload';
import { RESPONSE_MESSAGE } from '../../constants/response-message';
import { AuthAbilityFactory } from '../auth/casl/auth.ability.factory';
import { PERMISSIONS } from '../auth/casl/action.enum';
import { subject } from '@casl/ability';
import { RoleTypeNew } from '../../constants';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private generatorHelper: GeneratorHelper,
    private authAbilityFactory: AuthAbilityFactory
  ) {}

  public createHash(password: string): string {
    return hashSync(password, 10);
  }

  async create(
    userRegisterDto: UserRegisterDto,
    customerId?: string,
    subscriptionId?: string
  ): Promise<User> {
    try {
      const { email, password } = userRegisterDto;
      const checkUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (checkUser) {
        throw new HttpException('user_exists', HttpStatus.CONFLICT);
      }
      const hashPassword = this.createHash(password);
      const newUser = {} as User;
      newUser.id = this.generatorHelper.generateSnowflakeId();
      newUser.email = userRegisterDto.email;
      newUser.customerId = customerId;
      newUser.subscriptionId = subscriptionId;
      newUser.password = hashPassword;
      const user = await this.prisma.user.create({ data: newUser });
      const organization = await this.prisma.organization.create({
        data: {
          id: this.generatorHelper.generateSnowflakeId(),
          name: 'default',
          status: Status.ACTIVE,
          creatorId: user.id,
        },
      });
      await this.prisma.user.update({
        data: { organizationId: organization.id },
        where: { id: user.id },
      });

      const roleDefault = await this.prisma.role.findFirst({
        where: { name: RoleTypeNew.ADMINISTRATOR },
      });

      await this.prisma.grant.create({
        data: {
          userId: user.id,
          organizationId: BigInt(organization.id),
          roleId: roleDefault.id,
          isDefault: true,
          creatorId: user.id,
        },
      });
      user.organizationId = organization.id;
      const createTokenResponse = await this.tokenService.createToken(user);
      delete user.password;
      delete user.customerId;
      delete user.subscriptionId;
      delete user.subscriptionCreated;
      delete user.chargeId;
      delete user.chargeCreated;
      delete user.chargeUsed;
      return {
        user,
        ...createTokenResponse,
      };
    } catch (err) {
      throw err;
    }
  }

  async update(
    user: User,
    updateUserPayload: UpdateUserPayload
  ): Promise<User> {
    try {
      const { email, password, verifyPassword, organizationId } =
        updateUserPayload;

      const updateData = {} as User;
      if (email) {
        const checkUser = await this.prisma.user.findUnique({
          where: { email },
        });
        if (checkUser) {
          throw new BadRequestException(RESPONSE_MESSAGE.auth.emailExisted);
        }
        updateData.email = email;
      }

      if (password) {
        const newPassword = this.createHash(password);
        if (password !== verifyPassword)
          throw new BadRequestException(
            RESPONSE_MESSAGE.auth.verifyPasswordIncorrect
          );
        updateData.password = newPassword;
      }

      if (organizationId) {
        updateData.organizationId = BigInt(organizationId);
      }

      await this.prisma.user.update({
        data: updateData,
        where: {
          id: user.id,
        },
      });

      const createTokenResponse = await this.tokenService.createToken(user);
      delete user.password;
      return {
        user,
        ...createTokenResponse,
      };
    } catch (err) {
      throw err;
    }
  }

  async getUserDto(user: User): Promise<User> {
    delete user.password;
    delete user.customerId;
    delete user.subscriptionId;
    delete user.subscriptionCreated;
    delete user.chargeId;
    delete user.chargeCreated;
    delete user.chargeUsed;
    return user;
  }

  findOne(id: bigint): Promise<User> {
    id = BigInt(id);
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async testFunction(id: bigint): Promise<User> {
    console.log(id);
    const user = await this.prisma.user.findFirst({
      where: { id: BigInt(id) },
    });

    const createTokenResponse = await this.tokenService.createToken(user);
    return {
      user,
      ...createTokenResponse,
    };
  }
}
