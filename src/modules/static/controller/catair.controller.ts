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
import { ResponseInterceptor } from '../../../interceptors/response.interceptor';
import { CatairService } from '../service/catair.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import {
  SearchCatairPayload,
  SearchRelatedCatarPayload,
} from '../payload/catair/search-catair.payload';

@Controller('catairs')
@ApiTags('catairs')
export class CatairController {
  constructor(private catairservice: CatairService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Search Catairs' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @Query() searchCatairPayload: SearchCatairPayload
  ): Promise<any> {
    return await this.catairservice.searchWithPaginate(searchCatairPayload);
  }

  @Get('/related')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get all Catairs related to current selections',
  })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getRelated(
    @Query() SearchRelatedCatarPayload: SearchRelatedCatarPayload
  ): Promise<any> {
    return await this.catairservice.getByRelated(SearchRelatedCatarPayload);
  }
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Catair' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.catairservice.getDetail(id);
  }
}
