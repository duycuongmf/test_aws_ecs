export const RESPONSE_MESSAGE = {
  auth: {
    tokenInvalidOrExpired: 'Token is invalid or expired',
    userNotFound: 'User not found',
    passwordIncorrect: 'Password incorrect',
    verifyPasswordIncorrect: 'Verify Password incorrect',
    emailExisted: 'Email already existed',
    accessDenied: 'You do not have enough access rights',
  },
  users: {
    deleteUserSuccessfully: 'Deleted successfully',
    notFound: 'User not found',
  },
  imports: {
    importExisted: 'Import already existed',
    notFound: 'Import not found',
  },
  harvests: {
    notFound: 'Harvest not found',
  },
  organizations: {
    notFound: 'Organization not found',
    existed: 'Organization already existed',
  },
  grants: {
    notFound: 'Grant not found',
    existed: 'Grant already existed',
    default: 'You can not change default grant',
  },
  roles: {
    notFound: 'Role not found',
  },
  stripe: {
    createBillingPortalFail: 'Billing portal creation failed',
    notFound: 'Stripe not found',
    notFoundPriceType: 'PriceType not found',
    notFoundPrice: 'Price not found',
  },
  subscription: {
    notFound: 'Subscription not found',
  },
  stripePrice: {
    notFound: 'Price not found',
  },
  stripePayment: {
    notPay: 'You need to pay',
  },
  webhook: {
    failSignature: 'Stripe Signature not found',
  },
};
