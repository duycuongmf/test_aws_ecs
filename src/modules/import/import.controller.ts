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
  UseInterceptors,
} from '@nestjs/common';
import { ImportService } from './import.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '../../decorators';
import { RoleType } from '../../constants';
import { User } from '@prisma/client';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';
import { CreateImportPayload } from './payload/create-import.payload';
import { SearchImportPayload } from './payload/search-import.payload';
import { DeleteImportPayload } from './payload/delete-import.payload';
import { UpdateImportPayload } from './payload/update-import.payload';

@Controller('imports')
@ApiTags('imports')
export class ImportController {
  constructor(private importService: ImportService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Imports' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @AuthUser() user: User,
    @Query() searchImportPayload: SearchImportPayload
  ): Promise<any> {
    return await this.importService.searchWithPaginate(
      searchImportPayload,
      user
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Import' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(
    @AuthUser() user: User,
    @Param('id') id?: string
  ): Promise<object> {
    return await this.importService.getDetail(user, id);
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create Import' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async create(
    @AuthUser() user: User,
    @Body() createImportPayload: CreateImportPayload
  ): Promise<object> {
    return await this.importService.create(user, createImportPayload);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Update Import' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async update(
    @AuthUser() user: User,
    @Body() updateImportPayload: UpdateImportPayload,
    @Param('id') id: bigint
  ): Promise<object> {
    return await this.importService.update(user, id, updateImportPayload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Delete Import' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async delete(
    @AuthUser() user: User,
    @Param() deleteImportPayload: DeleteImportPayload
  ): Promise<boolean> {
    return await this.importService.delete(user, deleteImportPayload);
  }
}
