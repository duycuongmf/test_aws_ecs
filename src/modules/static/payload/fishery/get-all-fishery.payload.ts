import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Trim, NumberFieldOptional } from '../../../../decorators';

export class GetAllFisheryPayload {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly fisheryId?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly loffId?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly speciesId?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly countryId?: string;

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
