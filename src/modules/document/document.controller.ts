import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import * as multerS3 from 'multer-s3';
import { Auth, AuthUser } from '../../decorators';
import { RoleType } from '../../constants';
import { User } from '@prisma/client';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';
import { CreateDocumentPayload } from './payload/create-document.payload';
import { SearchDocumentPayload } from './payload/search-document.payload';
import { DeleteDocumentPayload } from './payload/delete-document.payload';
import { UpdateDocumentPayload } from './payload/update-document.payload';

import {
  buildFileName,
  imageFileFilter,
} from './implementation/document.implementation';

import { diskStorage } from 'multer';
import { IFile } from '../../interfaces';
import { FastifyFilesInterceptor } from '../../interceptors/fastify-files-interceptor';
import { S3Client } from '@aws-sdk/client-s3';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ConfigService } from '@nestjs/config';
import { AWSS3Service } from '../../shared/services/aws-s3.service';
import path from 'path';

@Controller('documents')
@ApiTags('documents')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Documents' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @Query() searchDocumentPayload: SearchDocumentPayload
  ): Promise<any> {
    return await this.documentService.searchWithPaginate(searchDocumentPayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Document' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.documentService.getDetail(id);
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create Document' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async create(
    @AuthUser() user: User,
    @Body() createDocumentPayload: CreateDocumentPayload
  ): Promise<object> {
    return await this.documentService.create(user, createDocumentPayload);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Update Document' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async update(
    @AuthUser() user: User,
    @Body() updateDocumentPayload: UpdateDocumentPayload,
    @Param('id') id: bigint
  ): Promise<object> {
    return await this.documentService.update(user, id, updateDocumentPayload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Delete Document' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async delete(
    @AuthUser() user: User,
    @Param() deleteDocumentPayload: DeleteDocumentPayload
  ): Promise<boolean> {
    return await this.documentService.delete(user, deleteDocumentPayload);
  }

  @Post('/upload')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Upload Document' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  @FastifyFilesInterceptor('files', 10, {
    storage: multerS3({
      s3: new S3Client(new ApiConfigService(new ConfigService()).s3Config),
      bucket: new ApiConfigService(new ConfigService()).s3Config.bucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: buildFileName,
    }),
    fileFilter: imageFileFilter,
  })
  async uploadFiles(
    @AuthUser() user: User,
    @Req() req: any,
    @Body() createDocumentPayload: CreateDocumentPayload
  ): Promise<any> {
    return await this.documentService.upload(
      user,
      req.files,
      createDocumentPayload
    );
  }
}
