import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '../../decorators';
import { RoleType } from '../../constants';
import { User } from '@prisma/client';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';
import { UpdateUserPayload } from './payload/search-catair.payload';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  @UseInterceptors(ResponseInterceptor)
  @ApiOkResponse({ description: 'update user info' })
  async updateCurrentUser(
    @AuthUser() user: User,
    @Body() updateUserPayload: UpdateUserPayload
  ): Promise<User> {
    return await this.usersService.update(user, updateUserPayload);
  }
}
