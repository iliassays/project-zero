import { Injectable } from '@nestjs/common';

@Injectable()
export class TradeMonitorService {
  getHello(): string {
    return 'Hello World!';
  }
}
