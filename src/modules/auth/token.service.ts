import { Injectable } from '@nestjs/common';
import { decode, sign } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { TokenType } from '../../constants';

@Injectable()
export class TokenService {
  constructor(private configService: ApiConfigService) {}

  public createToken(user: User): any {
    const accessExp = this.configService.authConfig.accessExpirationTime;
    const refreshExp = this.configService.authConfig.refreshExpirationTime;
    const secretKey = this.configService.authConfig.jwtKey;
    const accessToken = sign(
      { userId: user.id, type: TokenType.ACCESS_TOKEN },
      secretKey,
      {
        expiresIn: accessExp,
      }
    );
    const refreshToken = sign(
      { userId: user.id, type: TokenType.ACCESS_TOKEN },
      secretKey,
      {
        expiresIn: refreshExp,
      }
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  public decodeToken(token: string): any {
    return decode(token);
  }
}
