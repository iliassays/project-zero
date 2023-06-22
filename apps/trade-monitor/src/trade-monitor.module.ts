import { Module } from '@nestjs/common';
import { TradeMonitorController } from './trade-monitor.controller';
import { TradeMonitorService } from './trade-monitor.service';

@Module({
  imports: [],
  controllers: [TradeMonitorController],
  providers: [TradeMonitorService],
})
export class TradeMonitorModule {}
