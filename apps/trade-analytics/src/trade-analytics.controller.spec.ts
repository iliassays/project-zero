import { Test, TestingModule } from '@nestjs/testing';
import { TradeAnalyticsController } from './trade-analytics.controller';
import { TradeAnalyticsService } from './trade-analytics.service';

describe('TradeAnalyticsController', () => {
  let tradeAnalyticsController: TradeAnalyticsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TradeAnalyticsController],
      providers: [TradeAnalyticsService],
    }).compile();

    tradeAnalyticsController = app.get<TradeAnalyticsController>(TradeAnalyticsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tradeAnalyticsController.getHello()).toBe('Hello World!');
    });
  });
});
