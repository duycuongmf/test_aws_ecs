import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';
import { Trim } from '../../../decorators';

export class UpdateRoleOrganizationPayload {
  @ApiProperty()
  @IsString()
  @Trim()
  readonly roleId?: string;

  @ApiProperty()
  @IsNumberString()
  @Trim()
  readonly userId: string;
}
