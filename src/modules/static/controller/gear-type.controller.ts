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
import { GearTypeService } from '../service/gear-type.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import { SearchGearTypePayload } from '../payload/gear-type/search-gear-type.payload';

@Controller('gear-type')
@ApiTags('gear-type')
export class GearTypeController {
  constructor(private gearTypeService: GearTypeService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Gear-Type' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getAll(
    @Query() searchGearTypePayload: SearchGearTypePayload
  ): Promise<any> {
    return await this.gearTypeService.searchWithPaginate(searchGearTypePayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Gear-Type' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.gearTypeService.getDetail(id);
  }
}
