import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';

@Module({
  controllers: [],
  providers: [PrismaService, GeneratorHelper],
  exports: [],
})
export class ConvertModule {}
