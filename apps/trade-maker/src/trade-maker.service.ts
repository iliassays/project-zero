import { Injectable } from '@nestjs/common';

@Injectable()
export class TradeMakerService {
  getHello(): string {
    return 'Hello World!';
  }
}
