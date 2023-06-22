import { Module } from '@nestjs/common';
import { TradeSignalsController } from './trade-signals.controller';
import { TradeSignalsService } from './trade-signals.service';

@Module({
  imports: [],
  controllers: [TradeSignalsController],
  providers: [TradeSignalsService],
})
export class TradeSignalsModule {}
