import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import {
  CreateCheckoutSessionSchema,
  CreateCheckoutSessionInput,
  RefundRequestInput,
  UserRole,
} from '@shopflow/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments & Checkout')
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout/session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create checkout session and initiate payment intent' })
  async createSession(
    @CurrentUser() user: any,
    @Headers('idempotency-key') idempotencyKey: string,
    @Body(new ZodValidationPipe(CreateCheckoutSessionSchema)) input: CreateCheckoutSessionInput,
  ) {
    return this.paymentsService.createCheckoutSession(user.id, input, idempotencyKey);
  }

  @Post('webhooks/razorpay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook handler for Razorpay payment captured events' })
  async razorpayWebhook(
    @Body() payload: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentsService.verifyRazorpayWebhook(payload, signature);
  }

  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook handler for Stripe payment intent events' })
  async stripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    // In express, raw body or JSON buffer
    const bodyBuffer = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(JSON.stringify(req.body || {}));
    return this.paymentsService.verifyStripeWebhook(bodyBuffer, signature);
  }

  @Post('payments/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process payment refund for an order (Admin only)' })
  async refund(@Body() input: RefundRequestInput) {
    return this.paymentsService.processRefund(input);
  }
}
