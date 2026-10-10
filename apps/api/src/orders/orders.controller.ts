import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  UpdateOrderStatusSchema,
  CancelOrderSchema,
  ReturnOrderSchema,
  UpdateOrderStatusInput,
  CancelOrderInput,
  ReturnOrderInput,
  OrderStatus,
  UserRole,
} from '@shopflow/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current customer order history' })
  async getUserOrders(@CurrentUser() user: any) {
    return this.ordersService.getUserOrders(user.id);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order details by ID' })
  async getOrderById(@CurrentUser() user: any, @Param('id') id: string) {
    const isPrivileged = user.role === UserRole.ADMIN || user.role === UserRole.DELIVERY;
    return this.ordersService.getOrderById(id, isPrivileged ? undefined : user.id);
  }

  @Get('admin/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders with pagination and status filter (Admin only)' })
  async getAllOrders(
    @Query('status') status?: OrderStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.getAllOrders(
      status,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Patch('admin/orders/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order lifecycle status (Admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateOrderStatusSchema)) input: UpdateOrderStatusInput,
  ) {
    return this.ordersService.updateOrderStatus(id, input);
  }

  @Post('orders/:id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel pending order and restock inventory' })
  async cancelOrder(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CancelOrderSchema)) input: CancelOrderInput,
  ) {
    return this.ordersService.cancelOrder(user.id, id, input);
  }

  @Post('orders/:id/return')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request return for delivered order items' })
  async returnOrder(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(ReturnOrderSchema)) input: ReturnOrderInput,
  ) {
    return this.ordersService.returnOrder(user.id, id, input);
  }
}
