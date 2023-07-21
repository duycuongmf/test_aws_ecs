import { forwardRef, Module } from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { PrismaService } from '../../shared/services/prisma.service';
import { TokenService } from '../auth/token.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { HarvestPrismaRepository } from './harvest.prisma.repository';
import { AuthAbilityFactory } from '../auth/casl/auth.ability.factory';
import { StripeUsageSubscriptionService } from '../stripe/service/stripe.usage.subscription.service';
import { BullModule } from '@nestjs/bull';
import { JobType } from '../../constants/job-type';
import { StripeService } from '../stripe/service/stripe.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    forwardRef(() => HarvestModule),
    BullModule.registerQueue({
      name: JobType.STRIPE_JOBS,
    }),
    BullModule.registerQueue({
      name: JobType.USED_SERVICES_JOBS,
    }),
  ],
  controllers: [HarvestController],
  providers: [
    HarvestService,
    PrismaService,
    TokenService,
    GeneratorHelper,
    HarvestService,
    AuthAbilityFactory,
    StripeUsageSubscriptionService,
    StripeService,
    UserService,
    { provide: 'HarvestRepository', useClass: HarvestPrismaRepository },
  ],
  exports: [HarvestService],
})
export class HarvestModule {}
