import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../decorators';

export class CreateUserOrganizationPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No email provided' })
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No password provided' })
  public password: string;

  @ApiProperty()
  @IsString()
  @Trim()
  readonly roleId: string;
}
