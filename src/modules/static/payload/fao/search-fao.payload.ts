import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Trim, NumberFieldOptional } from '../../../../decorators';

export class SearchFAOPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @Trim()
  readonly fields?: string = null;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly query?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly type?: string = 'fuzzy';

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly include?: string;

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

export class SearchRelatedFAOPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @Trim()
  readonly rfmoId?: bigint = null;

  @ApiPropertyOptional()
  @IsOptional()
  @Trim()
  readonly eezId?: bigint = null;

  @ApiPropertyOptional()
  @IsOptional()
  @Trim()
  readonly catairId?: bigint = null;
}
