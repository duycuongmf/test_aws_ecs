import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtStrategy } from './jwt.strategy';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { StripeService } from '../stripe/service/stripe.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { BullModule } from '@nestjs/bull';
import { JobType } from '../../constants/job-type';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.jwtKey,
        signOptions: {
          expiresIn: configService.authConfig.accessExpirationTime,
        },
      }),
      inject: [ApiConfigService],
    }),
    BullModule.registerQueue({
      name: JobType.STRIPE_JOBS,
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GeneratorHelper,
    StripeService,
    PrismaService,
  ],
  exports: [JwtModule, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
