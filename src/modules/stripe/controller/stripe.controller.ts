import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StripeService } from '../service/stripe.service';
import { ResponseInterceptor } from '../../../interceptors/response.interceptor';
import { Auth, AuthUser } from '../../../decorators';
import { RoleType } from '../../../constants';
import { User } from '@prisma/client';
import { CreateStripeCheckoutSessionPayload } from '../payload/create-stripe-checkout-session.payload';

@Controller('stripe')
@ApiTags('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Get('/plans')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create Customer Portal Session' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async plans() {
    return await this.stripeService.plans();
  }

  @Post('/create-billing-portal')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create customer portal session' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async create(@AuthUser() user: User) {
    return await this.stripeService.createPortalSession(user);
  }
  @Post('/create-checkout-session')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create checkout session' })
  @UseInterceptors(ResponseInterceptor)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiBearerAuth()
  async createCheckout(
    @AuthUser() user: User,
    @Body()
    createStripeCheckoutSessionPayload: CreateStripeCheckoutSessionPayload
  ) {
    return await this.stripeService.createCheckoutSession(
      user,
      createStripeCheckoutSessionPayload
    );
  }

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create Customer Portal Session' })
  @UseInterceptors(ResponseInterceptor)
  async webhook(@Req() req) {
    return await this.stripeService.webhookJob(req.body, req.headers);
  }
}
