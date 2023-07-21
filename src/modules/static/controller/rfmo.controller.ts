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
import { RFMOService } from '../service/rfmo.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import {
  SearchRFMOPayload,
  SearchRelatedRFMOPayload,
} from '../payload/rfmo/search-rfmo.payload';

@Controller('rfmos')
@ApiTags('rfmos')
export class RFMOController {
  constructor(private rfmoService: RFMOService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all RFMOs' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(@Query() searchRFMOPayload: SearchRFMOPayload): Promise<any> {
    return await this.rfmoService.searchWithPaginate(searchRFMOPayload);
  }

  @Get('/related')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all RFMOs related to current selections' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getRelated(
    @Query() SearchRelatedRFMOPayload: SearchRelatedRFMOPayload
  ): Promise<any> {
    return await this.rfmoService.getByRelated(SearchRelatedRFMOPayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail RFMO' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetailSpecies(@Param('id') id?: string): Promise<object> {
    return await this.rfmoService.getDetail(id);
  }
}
