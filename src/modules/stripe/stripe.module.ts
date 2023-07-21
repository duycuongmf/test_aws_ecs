import { forwardRef, Module } from '@nestjs/common';
import { StripeService } from './service/stripe.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TokenService } from '../auth/token.service';
import { AuthAbilityFactory } from '../auth/casl/auth.ability.factory';
import { StripeController } from './controller/stripe.controller';
import { StripeJobs } from './jobs/stripe-jobs';
import { BullModule } from '@nestjs/bull';
import { JobType } from '../../constants/job-type';
import { StripeUsageSubscriptionService } from './service/stripe.usage.subscription.service';
import { UsedJobs } from './jobs/used-jobs';

@Module({
  imports: [
    forwardRef(() => StripeModule),
    BullModule.registerQueue({
      name: JobType.STRIPE_JOBS,
    }),
    BullModule.registerQueue({
      name: JobType.USED_SERVICES_JOBS,
    }),
  ],
  controllers: [StripeController],
  providers: [
    StripeService,
    StripeUsageSubscriptionService,
    PrismaService,
    GeneratorHelper,
    AuthService,
    JwtService,
    UserService,
    TokenService,
    AuthAbilityFactory,
    StripeJobs,
    UsedJobs,
  ],
  exports: [StripeService],
})
export class StripeModule {}
