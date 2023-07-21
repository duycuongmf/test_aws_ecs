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
import { FisheryService } from '../service/fishery.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import { SearchFisheryPayload } from '../payload/fishery/search-fishery.payload';
import { FindSpecialFisheryPayload } from '../payload/fishery/find-special-fishery.payload';

@Controller('fisheries')
@ApiTags('fisheries')
export class FisheryController {
  constructor(private fisheryService: FisheryService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Fisheries' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @Query() searchFisheryPayload: SearchFisheryPayload
  ): Promise<any> {
    return await this.fisheryService.searchWithPaginate(searchFisheryPayload);
  }

  @Get('/_find')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Find special query Fisheries' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getFind(
    @Query() findSpecialFisheryPayload: FindSpecialFisheryPayload
  ): Promise<any> {
    return await this.fisheryService.findSpecialWithPaginate(
      findSpecialFisheryPayload
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Fishery' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.fisheryService.getDetail(id);
  }
}
