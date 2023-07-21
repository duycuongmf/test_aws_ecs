import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { forwardRef, Inject } from '@nestjs/common';
import { JobType } from '../../../constants/job-type';
import { StripeUsageSubscriptionService } from '../service/stripe.usage.subscription.service';

@Processor(JobType.USED_SERVICES_JOBS)
export class UsedJobs {
  constructor(
    @Inject(forwardRef(() => StripeUsageSubscriptionService))
    private readonly stripeUsageSubscriptionService: StripeUsageSubscriptionService
  ) {}
  @Process(JobType.CREATE_USED_SERVICES_JOB)
  async createStripeUsageSubscriptionService(job: Job<{ body: any }>) {
    return await this.stripeUsageSubscriptionService.createStripeUsageSubscriptionService(
      job.data
    );
  }
}
