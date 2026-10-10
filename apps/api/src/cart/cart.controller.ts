import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartSchema, UpdateCartItemSchema, AddToCartInput, UpdateCartItemInput } from '@shopflow/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart with computed subtotals and taxes' })
  async getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add product variant item to cart' })
  async addItem(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(AddToCartSchema)) input: AddToCartInput,
  ) {
    return this.cartService.addItem(user.id, input);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateItem(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCartItemSchema)) input: UpdateCartItemInput,
  ) {
    return this.cartService.updateItem(user.id, id, input);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(@CurrentUser() user: any, @Param('id') id: string) {
    return this.cartService.removeItem(user.id, id);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear all items from cart' })
  async clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user.id);
  }
}
