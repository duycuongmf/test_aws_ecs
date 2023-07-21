import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Trim, NumberFieldOptional } from '../../../../decorators';

export class GetAllGearTypePayload {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly type?: string;

  @ApiPropertyOptional()
  @NumberFieldOptional({
    minimum: 0,
    default: 0,
    int: true,
  })
  readonly skip: number;

  @ApiPropertyOptional()
  @NumberFieldOptional({
    minimum: 1,
    default: 100,
    int: true,
  })
  readonly take: number;
}
