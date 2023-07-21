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
import { sCountry } from '@prisma/client';
import { ResponseInterceptor } from '../../../interceptors/response.interceptor';
import { CountryService } from '../service/country.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import {
  SearchCountryPayload,
  SearchRelatedCountryPayload,
} from '../payload/country/search-country.payload';

@Controller('countries')
@ApiTags('countries')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all countries' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @Query() searchCountryPayload: SearchCountryPayload
  ): Promise<any> {
    return await this.countryService.getCountries(searchCountryPayload);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail country' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetailSpecies(@Param('id') id?: string): Promise<sCountry> {
    return await this.countryService.getDetailCountry(id);
  }

  @Get('/related')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get all Countries related to current selections',
  })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getRelated(
    @Query() SearchRelatedCountryPayload: SearchRelatedCountryPayload
  ): Promise<any> {
    return await this.countryService.getByRelated(SearchRelatedCountryPayload);
  }

  //
  // @Get('/search')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ description: 'Search all countries' })
  // @UseInterceptors(ResponseInterceptor)
  // @Auth([RoleType.USER, RoleType.ADMIN])
  // @ApiBearerAuth()
  // async getSearch(
  //   @Query() searchAllCountryPayload: SearchAllCountryPayload
  // ): Promise<any> {
  //   return await this.countryService.getWithSearch(searchAllCountryPayload);
  // }
}
