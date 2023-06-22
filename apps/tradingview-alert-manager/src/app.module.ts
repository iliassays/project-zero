import { Module, Provider, Logger } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ContextInterceptor, ExceptionInterceptor } from 'libs/application';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestContextModule } from 'nestjs-request-context';
import { CqrsModule } from '@nestjs/cqrs';
import { RestartAllInactiveAlertHttpController } from './features/restart-all-inactive-alert/restart-all-inactive-alert.http.controller';
import { RestartAllInactiveAlertService } from './features/restart-all-inactive-alert/restart-all-inactive-alert.service';
import { RestartAllInactiveAlertJobController } from './features/restart-all-inactive-alert/restart-all-inactive-alert.job.controller';
import { TradingviewService } from './tradingview-actions/tradingview.service';
import { ConfigModule } from '@nestjs/config';
import tradingviewConfig from './configs/tradingview.config';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

const httpControllers = [RestartAllInactiveAlertHttpController];

const commandHandlers: Provider[] = [RestartAllInactiveAlertService];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [tradingviewConfig],
    }),
    ScheduleModule.forRoot(),
    RequestContextModule,
    CqrsModule,
  ],
  controllers: [...httpControllers],
  providers: [
    ...interceptors,
    ...commandHandlers,
    Logger,
    TradingviewService,
    RestartAllInactiveAlertJobController,
  ],
})
export class AppModule {}
