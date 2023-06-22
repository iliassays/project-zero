import { Controller, Get } from '@nestjs/common';
import { TradeSignalsService } from './trade-signals.service';

@Controller()
export class TradeSignalsController {
  constructor(private readonly tradeSignalsService: TradeSignalsService) {}

  @Get()
  getHello(): string {
    return this.tradeSignalsService.getHello();
  }
}
