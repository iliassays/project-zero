import { Injectable } from '@nestjs/common';

@Injectable()
export class TradeSignalsService {
  getHello(): string {
    return 'Hello World!';
  }
}
