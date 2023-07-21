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
import { VesselRegistrationService } from '../service/vessel-registration.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import { SearchVesselRegistrationPayload } from '../payload/vessel/search-vessel-registration.payload';

@Controller('vessel-registration')
@ApiTags('vessel-registration')
export class VesselRegistrationController {
  constructor(private vesselRegistrationService: VesselRegistrationService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Vessel-Registration' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @Query() getAllVesselRegistrationPayload: SearchVesselRegistrationPayload
  ): Promise<any> {
    return await this.vesselRegistrationService.getWithSearch(
      getAllVesselRegistrationPayload
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Vessel-Registration' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.vesselRegistrationService.getDetail(id);
  }
}
