import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../decorators';

export class CreateStripeCheckoutSessionPayload {
  @ApiProperty()
  @IsString()
  @Trim()
  readonly priceId: string;
}
