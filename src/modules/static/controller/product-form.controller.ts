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
import { GetAllProductFormPayload } from '../payload/product-form/get-all-product-form.payload';
import { ProductFormService } from '../service/product-form.service';
import { Auth } from '../../../decorators';
import { RoleType } from '../../../constants';
import { SearchProductFormPayload } from '../payload/product-form/search-product-form.payload';

@Controller('product-form')
@ApiTags('product-form')
export class ProductFormController {
  constructor(private productFormService: ProductFormService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Search Product-Form' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getAll(
    @Query() searchProductFormPayload: SearchProductFormPayload
  ): Promise<any> {
    return await this.productFormService.searchWithPaginate(
      searchProductFormPayload
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Product-Form' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(@Param('id') id?: string): Promise<object> {
    return await this.productFormService.getDetail(id);
  }
}
