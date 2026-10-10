import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductSchema,
  ProductFilterSchema,
  CreateProductInput,
  ProductFilterInput,
  UserRole,
} from '@shopflow/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get products with category, price, rating filters & pagination' })
  async findAll(@Query(new ZodValidationPipe(ProductFilterSchema)) query: ProductFilterInput) {
    return this.productsService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Full-text & fuzzy search across products' })
  async search(@Query('q') q: string) {
    return this.productsService.search(q);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get category tree and hierarchy' })
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get single product by slug with schema.org JSON-LD' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post('admin/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product with variants (Admin/Vendor only)' })
  async create(@Body(new ZodValidationPipe(CreateProductSchema)) input: CreateProductInput) {
    return this.productsService.create(input);
  }

  @Post('admin/products/import-csv')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk import products via CSV payload' })
  async importCsv(@Body('csvContent') csvContent: string) {
    return this.productsService.bulkImportCsv(csvContent);
  }
}
