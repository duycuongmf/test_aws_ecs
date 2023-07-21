import { ApiProperty } from '@nestjs/swagger';

import { TokenPayloadDto } from './token-payload.dto';
import { User } from '@prisma/client';

export class LoginPayloadDto {
  user: User;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(user: User, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
