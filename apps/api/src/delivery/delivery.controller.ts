import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import {
  DeliveryLocationPingSchema,
  UpdateDeliveryOrderStatusSchema,
  DeliveryLocationPing,
  UpdateDeliveryOrderStatusInput,
  UserRole,
} from '@shopflow/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Delivery Partner')
@Controller('delivery')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DELIVERY, UserRole.ADMIN)
@ApiBearerAuth()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('assignments')
  @ApiOperation({ summary: 'Get assigned orders for the authenticated delivery agent' })
  async getAssignments(@CurrentUser() user: any) {
    return this.deliveryService.getAssignments(user.id);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update order delivery status with OTP or proof of delivery' })
  async updateStatus(
    @CurrentUser() user: any,
    @Param('id') orderId: string,
    @Body(new ZodValidationPipe(UpdateDeliveryOrderStatusSchema)) input: UpdateDeliveryOrderStatusInput,
  ) {
    return this.deliveryService.updateDeliveryStatus(user.id, orderId, input);
  }

  @Post('location')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive live GPS ping from delivery mobile agent and broadcast via WS' })
  async pingLocation(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(DeliveryLocationPingSchema)) ping: DeliveryLocationPing,
  ) {
    return this.deliveryService.recordLocationPing(user.id, ping);
  }

  @Get('earnings')
  @ApiOperation({ summary: 'Get delivery agent earnings, payouts and performance stats' })
  async getEarnings(@CurrentUser() user: any) {
    return this.deliveryService.getEarnings(user.id);
  }
}
