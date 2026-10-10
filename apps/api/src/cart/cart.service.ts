import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartInput, UpdateCartItemInput, CartDto } from '@shopflow/shared';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async getCart(userId: string): Promise<CartDto> {
    const cart = await this.getOrCreateCart(userId);

    const items = cart.items.map((item) => {
      const price = item.variant.price;
      const subtotal = price * item.quantity;
      return {
        id: item.id,
        variantId: item.variantId,
        productId: item.variant.productId,
        title: item.variant.product.title,
        variantName: `${item.variant.size || ''} ${item.variant.color || ''}`.trim() || undefined,
        sku: item.variant.sku,
        price,
        quantity: item.quantity,
        image: item.variant.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        stockAvailable: item.variant.stock,
        subtotal,
      };
    });

    const subtotal = items.reduce((acc, curr) => acc + curr.subtotal, 0);
    const taxTotal = Math.round(subtotal * 0.18); // 18% GST standard
    const shippingTotal = subtotal > 1000 || subtotal === 0 ? 0 : 99; // Free shipping above 1000
    const discountTotal = 0; // calculated when coupon applied
    const grandTotal = subtotal + taxTotal + shippingTotal - discountTotal;

    return {
      id: cart.id,
      items,
      subtotal,
      discountTotal,
      taxTotal,
      shippingTotal,
      grandTotal,
    };
  }

  async addItem(userId: string, input: AddToCartInput) {
    const cart = await this.getOrCreateCart(userId);

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: input.variantId },
    });

    if (!variant || variant.deletedAt) {
      throw new NotFoundException('Selected product variant not found');
    }

    if (variant.stock < input.quantity) {
      throw new BadRequestException(`Only ${variant.stock} units available in stock`);
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: input.variantId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + input.quantity;
      if (variant.stock < newQuantity) {
        throw new BadRequestException(`Cannot add more than ${variant.stock} units`);
      }
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: input.variantId,
          quantity: input.quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, input: UpdateCartItemInput) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, variant: true },
    });

    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    if (input.quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      if (item.variant.stock < input.quantity) {
        throw new BadRequestException(`Only ${item.variant.stock} items available`);
      }
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: input.quantity },
      });
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { success: true };
  }
}
