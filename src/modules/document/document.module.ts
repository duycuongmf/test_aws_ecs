import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaService } from '../../shared/services/prisma.service';
import { TokenService } from '../auth/token.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { DocumentPrismaRepository } from './document.prisma.repository';

@Module({
  controllers: [DocumentController],
  providers: [
    DocumentService,
    PrismaService,
    TokenService,
    GeneratorHelper,
    DocumentService,
    { provide: 'DocumentRepository', useClass: DocumentPrismaRepository },
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
