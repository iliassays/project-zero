import { Module } from '@nestjs/common';
import { TradeMakerController } from './trade-maker.controller';
import { TradeMakerService } from './trade-maker.service';

@Module({
  imports: [],
  controllers: [TradeMakerController],
  providers: [TradeMakerService],
})
export class TradeMakerModule {}
