import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Document, User } from '@prisma/client';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { DocumentPrismaRepository } from './document.prisma.repository';
import { CreateDocumentPayload } from './payload/create-document.payload';
import { RESPONSE_MESSAGE } from '../../constants/response-message';
import { DeleteDocumentPayload } from './payload/delete-document.payload';
import { UpdateDocumentPayload } from './payload/update-document.payload';
import { GetAllDocumentPayload } from './payload/get-all-document.payload';
import { SearchDocumentPayload } from './payload/search-document.payload';
import { IFile } from '../../interfaces';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { AWSS3Service } from '../../shared/services/aws-s3.service';

@Injectable()
export class DocumentService {
  constructor(
    private generatorHelper: GeneratorHelper,
    private configService: ApiConfigService,
    @Inject('DocumentRepository')
    private documentRepository: DocumentPrismaRepository,
    private AWSs3Service: AWSS3Service
  ) {}

  async getWithPaginate(params: GetAllDocumentPayload): Promise<any> {
    try {
      return await this.documentRepository.paginate({
        skip: params.skip,
        take: params.take,
        select: {
          id: true,
          required: true,
          fulfilled: true,
          type: true,
          url: true,
          creatorId: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async searchWithPaginate(params: SearchDocumentPayload): Promise<any> {
    try {
      return await this.documentRepository.search({
        skip: params.skip,
        take: params.take,
        type: params.type,
        query: params.query,
        fields: params.fields,
        select: {
          id: true,
          required: true,
          type: true,
          url: true,
          fulfilled: true,
          creatorId: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
        },
        include: params.include
          ? {
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
        relationIds: ['organizationId', 'creatorId'],
      });
    } catch (err) {
      throw err;
    }
  }

  async getDetail(id?: string | bigint): Promise<Document> {
    try {
      if (!this.generatorHelper.isBigInt(id.toString()))
        throw new BadRequestException('The ID not is BigInt Type');
      return await this.documentRepository.first(id, {
        include: {
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
    } catch (err) {
      throw err;
    }
  }

  async create(
    user: User,
    createDocumentPayload: CreateDocumentPayload
  ): Promise<any> {
    try {
      return await this.documentRepository.create({
        id: this.generatorHelper.generateSnowflakeId(),
        name: createDocumentPayload.name,
        required: Boolean(createDocumentPayload.required),
        type: createDocumentPayload.type,
        url: createDocumentPayload.url,
        fulfilled: Boolean(createDocumentPayload.fulfilled),
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

  async upload(
    user: User,
    files: IFile[],
    createDocumentPayload: CreateDocumentPayload
  ): Promise<any> {
    try {
      const result = [];

      for (const file of files) {
        if (file.path && !file.size)
          throw new BadRequestException('File upload error');

        if (file && !file.key)
          throw new BadRequestException('Cannot find key aws s3');

        const document = await this.documentRepository.create({
          id: this.generatorHelper.generateSnowflakeId(),
          name: createDocumentPayload.name,
          required: Boolean(createDocumentPayload.required),
          type: createDocumentPayload.type,
          key: file.key,
          provider: 's3',
          fulfilled: Boolean(createDocumentPayload.fulfilled),
          creator: {
            connect: { id: user.id },
          },
          organization: {
            connect: { id: user.organizationId },
          },
        });
        result.push({
          ...document,
          url: await this.AWSs3Service.getSignedUrl(document.key),
        });
      }
      return result;
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }

  async update(
    user: User,
    id: bigint,
    updateDocumentPayload: UpdateDocumentPayload
  ): Promise<any> {
    try {
      const dataInit = {};
      if (updateDocumentPayload.name) {
        dataInit['name'] = updateDocumentPayload.name;
      }
      if (updateDocumentPayload.required) {
        dataInit['required'] = Boolean(updateDocumentPayload.required);
      }
      if (updateDocumentPayload.type) {
        dataInit['type'] = updateDocumentPayload.type;
      }
      if (updateDocumentPayload.url) {
        dataInit['url'] = updateDocumentPayload.url;
      }
      if (updateDocumentPayload.fulfilled) {
        dataInit['fulfilled'] = Boolean(updateDocumentPayload.fulfilled);
      }
      return await this.documentRepository.update({
        data: dataInit,
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
    deleteDocumentPayload: DeleteDocumentPayload
  ): Promise<boolean> {
    try {
      const document = await this.documentRepository.first(
        BigInt(deleteDocumentPayload.id)
      );
      if (document) {
        const _delete = await this.documentRepository.deleteMany({
          id: BigInt(deleteDocumentPayload.id),
          creatorId: user.id,
        });
        await this.AWSs3Service.delete(document.key);
        return _delete.count === 1;
      }

      return false;
    } catch (e) {
      throw new BadRequestException(e.meta?.cause || e.message);
    }
  }
}
