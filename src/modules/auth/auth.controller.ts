import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  UseInterceptors,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserService } from '../user/user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from '@prisma/client';
import { Auth, AuthUser } from '../../decorators';
import { RoleType } from '../../constants';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UserService,
    private configService: ApiConfigService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    description: 'Register user',
  })
  async register(@Body() userRegisterDto: UserRegisterDto): Promise<User> {
    return await this.authService.register(userRegisterDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async login(@Body() userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    return await this.authService.checkLogin(userLoginDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<LoginPayloadDto> {
    return await this.authService.verifyRefreshToken(
      refreshTokenDto.refreshToken
    );
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  @UseInterceptors(ResponseInterceptor)
  @ApiOkResponse({ description: 'current user info' })
  async getCurrentUser(@AuthUser() user: User): Promise<User> {
    return await this.usersService.getUserDto(user);
  }

  // @Get('test/:id')
  // @HttpCode(HttpStatus.OK)
  // @UseInterceptors(ResponseInterceptor)
  // @ApiOkResponse({ description: 'current user info' })
  // async test(@Param('id') id: bigint): Promise<User> {
  //   return await this.usersService.testFunction(id);
  // }
}
