import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { Trim } from '../../../decorators';

export class CreateHarvestPayload {
  @ApiProperty()
  @IsNumberString()
  @Trim()
  readonly importId: bigint;
}
