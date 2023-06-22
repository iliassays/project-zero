import { Test, TestingModule } from '@nestjs/testing';
import { TradeMonitorController } from './trade-monitor.controller';
import { TradeMonitorService } from './trade-monitor.service';

describe('TradeMonitorController', () => {
  let tradeMonitorController: TradeMonitorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TradeMonitorController],
      providers: [TradeMonitorService],
    }).compile();

    tradeMonitorController = app.get<TradeMonitorController>(TradeMonitorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tradeMonitorController.getHello()).toBe('Hello World!');
    });
  });
});
