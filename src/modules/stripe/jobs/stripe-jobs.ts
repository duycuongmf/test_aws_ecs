import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { forwardRef, Inject } from '@nestjs/common';
import { StripeService } from '../service/stripe.service';
import { JobType } from '../../../constants/job-type';
import { StripeUsageSubscriptionService } from '../service/stripe.usage.subscription.service';

@Processor(JobType.STRIPE_JOBS)
export class StripeJobs {
  constructor(
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    private readonly stripeUsageSubscriptionService: StripeUsageSubscriptionService
  ) {}

  @Process(JobType.CREATE_STRIPE_WEBHOOK_JOB)
  async createStripeWebhook(job: Job<{ body: any }>) {
    await this.stripeService.stripeData(job.data.body, true);
  }

  @Process(JobType.CREATE_STRIPE_EVENT_FETCHING_DATA_JOB)
  async createEventFetchingData(job: Job<{ body: any }>) {
    await this.stripeService.stripeData(job.data.body, false);
  }

  @Process(JobType.CREATE_STRIPE_EVENT_HISTORY_JOB)
  async createStripeEventHistory(job: Job<{ eventLogs: any }>) {
    await this.stripeService.jobEventFetchingData(job.data.eventLogs);
  }
}
