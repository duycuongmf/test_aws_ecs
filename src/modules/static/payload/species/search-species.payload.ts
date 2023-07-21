import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import {
  Trim,
  NumberFieldOptional,
  IsUndefinable,
} from '../../../../decorators';

export class SearchSpeciesPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @Trim()
  readonly fields?: string = null;

  @ApiPropertyOptional()
  @IsUndefinable()
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
