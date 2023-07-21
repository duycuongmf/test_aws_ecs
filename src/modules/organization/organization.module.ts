import { Module } from '@nestjs/common';
import { OrganizationController } from './controller/organization.controller';
import { OrganizationService } from './service/organization.service';
import { OrganizationPrismaRepository } from './organization.prisma.repository';
import { AuthAbilityFactory } from '../auth/casl/auth.ability.factory';
import { PrismaService } from '../../shared/services/prisma.service';
import { TokenService } from '../auth/token.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { UserService } from '../user/user.service';

@Module({
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    PrismaService,
    TokenService,
    GeneratorHelper,
    AuthAbilityFactory,
    UserService,
    {
      provide: 'OrganizationRepository',
      useClass: OrganizationPrismaRepository,
    },
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
