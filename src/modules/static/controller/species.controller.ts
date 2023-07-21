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
import { sSpecies } from '@prisma/client';
import { SpeciesService } from '../service/species.service';
import { ResponseInterceptor } from '../../../interceptors/response.interceptor';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import { SearchSpeciesPayload } from '../payload/species/search-species.payload';

@Controller('species')
@ApiTags('species')
export class SpeciesController {
  constructor(private speciesService: SpeciesService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get list species' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @Query() searchSpeciesPayload: SearchSpeciesPayload
  ): Promise<any> {
    return await this.speciesService.searchWithPaginate(searchSpeciesPayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail species' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<sSpecies> {
    return await this.speciesService.getDetailSpecies(id);
  }

  @Get('/:id/tariffs')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get tariffs related species' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getTariffs(@Param('id') id?: string): Promise<sSpecies> {
    return await this.speciesService.getTariffBySpecies(id);
  }
}
