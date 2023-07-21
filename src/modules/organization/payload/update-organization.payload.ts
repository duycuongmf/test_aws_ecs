import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../decorators';

export class UpdateOrganizationPayload {
  @ApiProperty()
  @IsString()
  @Trim()
  readonly name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address?: string;
}
