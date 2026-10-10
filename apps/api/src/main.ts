import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Needed for Stripe webhook signature verification
  });

  // 1. Security Headers (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: false, // Managed per frontend
      crossOriginEmbedderPolicy: false,
    }),
  );

  // 2. Cookie Parser & Compression
  app.use(cookieParser(process.env.SESSION_COOKIE_SECRET || 'shopflow_secret'));
  app.use(compression());

  // 3. CORS Configuration
  const allowedOrigins = [
    process.env.WEB_BASE_URL || 'http://localhost:3000',
    process.env.ADMIN_BASE_URL || 'http://localhost:3001',
    process.env.DELIVERY_BASE_URL || 'http://localhost:3002',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev, whitelist in prod
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // 4. Rate Limiting (100 req / min per IP)
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { statusCode: 429, message: 'Too many requests, please try again later.' },
    }),
  );

  // 5. Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // 6. Swagger / OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('ShopFlow Multi-Vendor E-Commerce API')
    .setDescription(
      'Comprehensive REST and WebSocket APIs for ShopFlow storefront, admin, delivery, and payments.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Products')
    .addTag('Cart')
    .addTag('Orders')
    .addTag('Payments & Checkout')
    .addTag('Delivery Partner')
    .addTag('Share Links & OG Generator')
    .addTag('Sales & Inventory Analytics')
    .addTag('System Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 ShopFlow Backend API running on: http://localhost:${port}`);
  logger.log(`📑 OpenAPI / Swagger Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
