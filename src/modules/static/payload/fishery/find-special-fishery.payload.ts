import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { Trim, NumberFieldOptional } from '../../../../decorators';

export class FindSpecialFisheryPayload {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  @Trim()
  readonly speciesId?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  @Trim()
  readonly gearId?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  @Trim()
  readonly countryId?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  @Trim()
  readonly eezId?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  @Trim()
  readonly rfmoId?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  @Trim()
  readonly faoId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly highSeas?: string;

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
