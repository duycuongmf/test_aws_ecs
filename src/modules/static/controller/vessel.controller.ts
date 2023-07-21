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
import { sVessel } from '@prisma/client';
import { ResponseInterceptor } from '../../../interceptors/response.interceptor';
import { VesselService } from '../service/vessel.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import { SearchVesselPayload } from '../payload/vessel/search-vessel.payload';

@Controller('vessels')
@ApiTags('vessels')
export class VesselController {
  constructor(private vesselService: VesselService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Vessels' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @Query() searchVesselPayload: SearchVesselPayload
  ): Promise<any> {
    return await this.vesselService.searchWithPaginate(searchVesselPayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Vessel' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<sVessel> {
    return await this.vesselService.getDetail(id);
  }
}
