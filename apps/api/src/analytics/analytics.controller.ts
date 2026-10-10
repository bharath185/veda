import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@shopflow/shared';

@ApiTags('Sales & Inventory Analytics')
@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Get key sales KPIs (Revenue, Orders, AOV, Conversion Rate)' })
  async getSales(@Query('range') range: string = '30d') {
    return this.analyticsService.getSalesKpis(range);
  }

  @Get('trend')
  @ApiOperation({ summary: 'Get daily revenue and order volume trend' })
  async getTrend(@Query('range') range: string = '30d') {
    return this.analyticsService.getRevenueTrend(range);
  }

  @Get('funnel')
  @ApiOperation({ summary: 'Get checkout conversion funnel drop-off stats' })
  async getFunnel() {
    return this.analyticsService.getCheckoutFunnel();
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top 5 best performing products by volume and revenue' })
  async getTopProducts() {
    return this.analyticsService.getTopProducts();
  }

  @Get('revenue-by-channel')
  @ApiOperation({ summary: 'Get revenue contribution broken down by acquisition channel' })
  async getChannelMix() {
    return this.analyticsService.getChannelMix();
  }

  @Get('inventory-turnover')
  @ApiOperation({ summary: 'Get inventory turnover ratio and low-stock alerts' })
  async getInventoryTurnover() {
    return this.analyticsService.getInventoryTurnover();
  }
}
