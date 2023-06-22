import { Controller, Get } from '@nestjs/common';
import { TradeAnalyticsService } from './trade-analytics.service';

@Controller()
export class TradeAnalyticsController {
  constructor(private readonly tradeAnalyticsService: TradeAnalyticsService) {}

  @Get()
  getHello(): string {
    return this.tradeAnalyticsService.getHello();
  }
}
