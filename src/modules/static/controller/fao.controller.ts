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
import { FAOService } from '../service/fao.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import {
  SearchFAOPayload,
  SearchRelatedFAOPayload,
} from '../payload/fao/search-fao.payload';

@Controller('faos')
@ApiTags('faos')
export class FAOController {
  constructor(private faoService: FAOService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Search all FAOs' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(@Query() searchFAOPayload: SearchFAOPayload): Promise<any> {
    return await this.faoService.searchWithPaginate(searchFAOPayload);
  }

  @Get('/related')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all FAOs related to current selections' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getRelated(
    @Query() SearchRelatedFAOPayload: SearchRelatedFAOPayload
  ): Promise<any> {
    return await this.faoService.getByRelated(SearchRelatedFAOPayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail FAO' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.faoService.getDetail(id);
  }
}
