import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';
import { Trim, NumberFieldOptional } from '../../../decorators';

export class GetAllHarvestPayload {
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

  @ApiPropertyOptional()
  @IsNumberString()
  @Trim()
  @IsOptional()
  readonly importId: string;
}
