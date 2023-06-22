import { Test, TestingModule } from '@nestjs/testing';
import { TradeMakerController } from './trade-maker.controller';
import { TradeMakerService } from './trade-maker.service';

describe('TradeMakerController', () => {
  let tradeMakerController: TradeMakerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TradeMakerController],
      providers: [TradeMakerService],
    }).compile();

    tradeMakerController = app.get<TradeMakerController>(TradeMakerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tradeMakerController.getHello()).toBe('Hello World!');
    });
  });
});
