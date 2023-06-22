import { Controller, Get } from '@nestjs/common';
import { TradeMakerService } from './trade-maker.service';

@Controller()
export class TradeMakerController {
  constructor(private readonly tradeMakerService: TradeMakerService) {}

  @Get()
  getHello(): string {
    return this.tradeMakerService.getHello();
  }
}
