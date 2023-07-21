import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../shared/services/prisma.service';
import { TokenService } from '../auth/token.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { AuthAbilityFactory } from '../auth/casl/auth.ability.factory';
import { StripeService } from '../stripe/service/stripe.service';
import { JobType } from '../../constants/job-type';
import { BullModule } from '@nestjs/bull';
import { StripeUsageSubscriptionService } from '../stripe/service/stripe.usage.subscription.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { StripeJobs } from '../stripe/jobs/stripe-jobs';
import { UsedJobs } from '../stripe/jobs/used-jobs';

@Module({
  imports: [
    forwardRef(() => UserModule),
    BullModule.registerQueue({
      name: JobType.STRIPE_JOBS,
    }),
    BullModule.registerQueue({
      name: JobType.USED_SERVICES_JOBS,
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    TokenService,
    GeneratorHelper,
    AuthAbilityFactory,
    StripeService,
    StripeUsageSubscriptionService,
    AuthService,
    JwtService,
  ],
  exports: [UserService],
})
export class UserModule {}
