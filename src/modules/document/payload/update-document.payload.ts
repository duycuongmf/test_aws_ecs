import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Trim, ToBoolean } from '../../../decorators';

export class UpdateDocumentPayload {
  @ApiPropertyOptional()
  @IsString()
  @Trim()
  readonly name: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly type?: string;

  @ApiPropertyOptional()
  @ToBoolean()
  @Trim()
  @IsOptional()
  readonly required?: boolean;

  @ApiPropertyOptional()
  @ToBoolean()
  @Trim()
  @IsOptional()
  readonly fulfilled?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly url?: string;
}
