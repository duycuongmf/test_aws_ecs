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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from '../service/organization.service';
import { ResponseInterceptor } from '../../../interceptors/response.interceptor';
import { Auth, AuthUser } from '../../../decorators';
import { RoleType } from '../../../constants';
import { User } from '@prisma/client';
import { CreateOrganizationPayload } from '../payload/create-organization.payload';
import { UpdateOrganizationPayload } from '../payload/update-organization.payload';
import { DeleteOrganizationPayload } from '../payload/delete-organization.payload';
import { GetAllOrganizationPayload } from '../payload/get-all-organization.payload';
import { UpdateRoleOrganizationPayload } from '../payload/update-role-organization.payload';
import { CreateUserOrganizationPayload } from '../payload/create-user-organization.payload';

@Controller('organizations')
@ApiTags('organizations')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all Organization' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getSearch(
    @AuthUser() user: User,
    @Query() getAllOrganizationPayload: GetAllOrganizationPayload
  ): Promise<any> {
    return await this.organizationService.getWithPaginate(
      getAllOrganizationPayload,
      user
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get Detail Organization' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getDetail(
    @AuthUser() user: User,
    @Param('id') id: bigint
  ): Promise<object> {
    return await this.organizationService.getDetail(id, user);
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create Organization' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async create(
    @AuthUser() user: User,
    @Body() createOrganizationPayload: CreateOrganizationPayload
  ): Promise<object> {
    return await this.organizationService.create(
      user,
      createOrganizationPayload
    );
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Update Organization' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async update(
    @AuthUser() user: User,
    @Body() updateOrganizationPayload: UpdateOrganizationPayload,
    @Param('id') id: bigint
  ): Promise<object> {
    return await this.organizationService.update(
      user,
      id,
      updateOrganizationPayload
    );
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Delete Organization' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async delete(
    @AuthUser() user: User,
    @Param() deleteOrganizationPayload: DeleteOrganizationPayload
  ): Promise<boolean> {
    return await this.organizationService.delete(
      user,
      deleteOrganizationPayload
    );
  }

  @Post('/:id/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Update Role Organization' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async updateRole(
    @AuthUser() user: User,
    @Body() updateRoleOrganizationPayload: UpdateRoleOrganizationPayload,
    @Param('id') id: bigint
  ): Promise<object> {
    return await this.organizationService.updateRole(
      user,
      id,
      updateRoleOrganizationPayload
    );
  }

  @Get('/:id/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get All Roles Organization' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async getRole(
    @AuthUser() user: User,
    @Param('id') id: bigint
  ): Promise<object> {
    return await this.organizationService.getRoles(user, id);
  }

  @Post('/:id/users')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create User via Organization' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async createUser(
    @AuthUser() user: User,
    @Body() createUserOrganizationDto: CreateUserOrganizationPayload,
    @Param('id') id: bigint
  ): Promise<object> {
    return await this.organizationService.createUser(
      user,
      id,
      createUserOrganizationDto
    );
  }
}
