import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { Trim } from '../../../decorators';

export class DeleteDocumentPayload {
  @ApiProperty()
  @IsNumberString()
  @Trim()
  readonly id: bigint;
}
