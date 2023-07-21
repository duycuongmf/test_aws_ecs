import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { Trim } from '../../../decorators';

export class CreateImportPayload {
  @ApiProperty()
  @IsNumberString()
  @Trim()
  readonly exportFromId: bigint;

  @ApiProperty()
  @IsNumberString()
  @Trim()
  readonly importToId: bigint;
}
