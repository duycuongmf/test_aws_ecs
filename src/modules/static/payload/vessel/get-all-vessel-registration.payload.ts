import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Trim, NumberFieldOptional } from '../../../../decorators';

export class GetAllVesselRegistrationPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @Trim()
  readonly id?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly value?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly type?: string;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  @IsOptional()
  readonly vesselId?: string;

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
