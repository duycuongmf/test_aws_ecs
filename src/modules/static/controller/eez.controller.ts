import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { sEEZ } from '@prisma/client';
import { ResponseInterceptor } from '../../../interceptors/response.interceptor';
import { EEZService } from '../service/eez.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import {
  SearchEEZPayload,
  SearchRelatedEEZPayload,
} from '../payload/eez/search-eez.payload';

@Controller('eezs')
@ApiTags('eez')
export class EEZController {
  constructor(private eezService: EEZService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all EEZs' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(@Query() searchEEZPayload: SearchEEZPayload): Promise<any> {
    return await this.eezService.searchWithPaginate(searchEEZPayload);
  }

  @Get('/related')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all RFMOs related to current selections' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getRelated(
    @Query() SearchRelatedEEZPayload: SearchRelatedEEZPayload
  ): Promise<any> {
    return await this.eezService.getByRelated(SearchRelatedEEZPayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail EEZ' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.eezService.getDetail(id);
  }
}
