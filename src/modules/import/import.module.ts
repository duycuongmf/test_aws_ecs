import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { PrismaService } from '../../shared/services/prisma.service';
import { TokenService } from '../auth/token.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { ImportPrismaRepository } from './import.prisma.repository';
import { AuthAbilityFactory } from '../auth/casl/auth.ability.factory';

@Module({
  controllers: [ImportController],
  providers: [
    ImportService,
    PrismaService,
    TokenService,
    GeneratorHelper,
    ImportService,
    AuthAbilityFactory,
    { provide: 'ImportRepository', useClass: ImportPrismaRepository },
  ],
  exports: [ImportService],
})
export class ImportModule {}
