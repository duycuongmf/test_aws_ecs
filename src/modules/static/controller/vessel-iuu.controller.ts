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
import { VesselIUUService } from '../service/vessel-iuu.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import { SearchVesselRegistrationPayload } from '../payload/vessel/search-vessel-registration.payload';
import { GetAllVesselIUUPayload } from 'src/modules/static/payload/vessel/get-all-vessel-iuu.payload';

@Controller('vessel-iuu')
@ApiTags('vessel-iuu')
export class VesselIUUController {
  constructor(private vesselIUUService: VesselIUUService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Vessel-IUU' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getAll(
    @Query() searchVesselIUUPayload: SearchVesselRegistrationPayload
  ): Promise<any> {
    return await this.vesselIUUService.searchWithPaginate(
      searchVesselIUUPayload
    );
  }

  @Get('/find')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Vessel-IUU' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getWithPaginate(
    @Query() GetAllVesselIUUPayload: GetAllVesselIUUPayload
  ): Promise<object> {
    return await this.vesselIUUService.getWithPaginate(GetAllVesselIUUPayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Vessel-IUU' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.vesselIUUService.getDetail(id);
  }
}
