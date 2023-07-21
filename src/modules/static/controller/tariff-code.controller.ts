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
import { TariffService } from '../service/tariff.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import { SearchTariffPayload } from '../payload/tariff/search-tariff.payload';

@Controller('tariffs')
@ApiTags('tariffs')
export class TariffCodeController {
  constructor(private tariffService: TariffService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Tariffs' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @Query() searchTariffPayload: SearchTariffPayload
  ): Promise<any> {
    return await this.tariffService.searchWithPaginate(searchTariffPayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Tariff' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.tariffService.getDetail(id);
  }
}
