import { Controller, Get } from '@nestjs/common';
import { TradeMonitorService } from './trade-monitor.service';

@Controller()
export class TradeMonitorController {
  constructor(private readonly tradeMonitorService: TradeMonitorService) {}

  @Get()
  getHello(): string {
    return this.tradeMonitorService.getHello();
  }
}
