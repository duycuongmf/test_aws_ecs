import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { Trim } from '../../../decorators';

export class UpdateUserPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @Trim()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  readonly password?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  readonly verifyPassword?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @Trim()
  readonly organizationId?: string;
}
