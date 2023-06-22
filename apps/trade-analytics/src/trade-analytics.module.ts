import { Module } from '@nestjs/common';
import { TradeAnalyticsController } from './trade-analytics.controller';
import { TradeAnalyticsService } from './trade-analytics.service';

@Module({
  imports: [],
  controllers: [TradeAnalyticsController],
  providers: [TradeAnalyticsService],
})
export class TradeAnalyticsModule {}
