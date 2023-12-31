export const StripeEvents = {
  EVENT_CHECK: {
    SUBSCRIPTION: {
      RUNNING: {
        STATUS: ['trialing', 'active', 'incomplete'],
        EVENT: [
          'customer.subscription.created',
          'customer.subscription.deleted',
          'customer.subscription.paused',
          'customer.subscription.pending_update_applied',
          'customer.subscription.pending_update_expired',
          'customer.subscription.resumed',
          'customer.subscription.trial_will_end',
          'customer.subscription.updated',
          'subscription_schedule.aborted',
          'subscription_schedule.canceled',
          'subscription_schedule.completed',
          'subscription_schedule.created',
          'subscription_schedule.expiring',
          'subscription_schedule.released',
          'subscription_schedule.updated',
        ],
      },
    },
    CHARGE: {
      RUNNING: {
        STATUS: ['succeeded'],
        EVENT: [
          'charge.captured',
          'charge.expired',
          'charge.failed',
          'charge.pending',
          'charge.refunded',
          'charge.succeeded',
          'charge.updated',
          'charge.dispute.closed',
          'charge.dispute.created',
          'charge.dispute.funds_reinstated',
          'charge.dispute.funds_withdrawn',
          'charge.dispute.updated',
          'charge.refund.updated',
        ],
      },
      EVENT_USED: ['payment_intent.succeeded', 'charge.succeeded'],
    },
    PAYMENT_INTENT: {
      RUNNING: {
        STATUS: ['succeeded'],
        EVENT: [
          'payment_intent.amount_capturable_updated',
          'payment_intent.canceled',
          'payment_intent.created',
          'payment_intent.partially_funded',
          'payment_intent.payment_failed',
          'payment_intent.processing',
          'payment_intent.requires_action',
          'payment_intent.succeeded',
        ],
      },
    },
  },
  EVENT: [
    // Subscription
    'customer.subscription.created',
    'customer.subscription.deleted',
    'customer.subscription.paused',
    'customer.subscription.pending_update_applied',
    'customer.subscription.pending_update_expired',
    'customer.subscription.resumed',
    'customer.subscription.trial_will_end',
    'customer.subscription.updated',
    'subscription_schedule.aborted',
    'subscription_schedule.canceled',
    'subscription_schedule.completed',
    'subscription_schedule.created',
    'subscription_schedule.expiring',
    'subscription_schedule.released',
    'subscription_schedule.updated',
    // Charge
    'charge.captured',
    'charge.dispute.closed',
    'charge.dispute.created',
    'charge.dispute.funds_reinstated',
    'charge.dispute.funds_withdrawn',
    'charge.dispute.updated',
    'charge.expired',
    'charge.failed',
    'charge.pending',
    'charge.refund.updated',
    'charge.refunded',
    'charge.succeeded',
    'charge.updated',
    // Plan, Price, Product
    'plan.created',
    'plan.deleted',
    'plan.updated',
    'price.created',
    'price.deleted',
    'price.updated',
    'product.created',
    'product.deleted',
    'product.updated',
    // Refun
    'refund.created',
    'refund.updated',
    // Billing
    'billing_portal.configuration.created',
    'billing_portal.configuration.updated',
    'billing_portal.session.created',
  ],
};
