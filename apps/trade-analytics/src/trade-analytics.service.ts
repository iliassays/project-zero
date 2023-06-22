import { Injectable } from '@nestjs/common';

@Injectable()
export class TradeAnalyticsService {
  getHello(): string {
    return 'Hello World!';
  }
}
