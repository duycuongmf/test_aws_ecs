import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '../../decorators';
import { RoleType } from '../../constants';
import { User } from '@prisma/client';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';
import { CreateHarvestPayload } from './payload/create-harvest.payload';
import { DeleteHarvestPayload } from './payload/delete-harvest.payload';
import { UpdateHarvestPayload } from './payload/update-harvest.payload';
import { GetAllHarvestPayload } from './payload/get-all-harvest.payload';

@Controller('harvests')
@ApiTags('harvests')
export class HarvestController {
  constructor(private harvestService: HarvestService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Harvests' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @AuthUser() user: User,
    @Query() getAllHarvestPayload: GetAllHarvestPayload
  ): Promise<any> {
    return await this.harvestService.getWithPaginate(
      getAllHarvestPayload,
      user
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail Harvest' })
  @UseInterceptors(ResponseInterceptor)
  @ApiBearerAuth()
  @Auth([RoleType.USER, RoleType.ADMIN])
  async getDetail(
    @AuthUser() user: User,
    @Param('id') id?: string
  ): Promise<object> {
    return await this.harvestService.getDetail(id, user);
  }

  @Get('/public/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get detail public Harvest' })
  @UseInterceptors(ResponseInterceptor)
  // HoangHN - Temporary public API.
  // @ApiBearerAuth()
  async getPublicDetail(@Param('id') id?: string): Promise<object> {
    return await this.harvestService.getDetailPublic(id);
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create Harvest' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async create(
    @AuthUser() user: User,
    @Body() createHarvestPayload: CreateHarvestPayload
  ): Promise<object> {
    return await this.harvestService.create(user, createHarvestPayload);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Update Harvest' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async update(
    @AuthUser() user: User,
    @Body() updateHarvestPayload: UpdateHarvestPayload,
    @Param('id') id: bigint
  ): Promise<object> {
    return await this.harvestService.update(user, id, updateHarvestPayload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Delete Harvest' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async delete(
    @AuthUser() user: User,
    @Param() deleteHarvestPayload: DeleteHarvestPayload
  ): Promise<boolean> {
    return await this.harvestService.delete(user, deleteHarvestPayload);
  }
}
