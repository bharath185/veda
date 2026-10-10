export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  DELIVERY = 'DELIVERY',
  VENDOR = 'VENDOR',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum PaymentGateway {
  RAZORPAY = 'RAZORPAY',
  STRIPE = 'STRIPE',
  COD = 'COD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PaymentMethod {
  UPI = 'UPI',
  CARD = 'CARD',
  NETBANKING = 'NETBANKING',
  WALLET = 'WALLET',
  COD = 'COD',
}

export enum DeliveryAgentStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

export enum SharePlatform {
  INSTAGRAM = 'instagram',
  WHATSAPP = 'whatsapp',
  TWITTER = 'twitter',
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
  BOGO = 'BOGO',
}
