import { Test, TestingModule } from '@nestjs/testing';
import { TradeSignalsController } from './trade-signals.controller';
import { TradeSignalsService } from './trade-signals.service';

describe('TradeSignalsController', () => {
  let tradeSignalsController: TradeSignalsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TradeSignalsController],
      providers: [TradeSignalsService],
    }).compile();

    tradeSignalsController = app.get<TradeSignalsController>(TradeSignalsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tradeSignalsController.getHello()).toBe('Hello World!');
    });
  });
});
