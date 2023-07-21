import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';

@ValidatorConstraint({ name: 'UserNotExistsValidator', async: true })
@Injectable()
export class UserNotExistsValidator implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: value },
      });

      if (user !== null) {
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Email already existed`;
  }
}
