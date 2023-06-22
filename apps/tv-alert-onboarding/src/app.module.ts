import { Logger, Module, Provider } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import alertApiConfig from './configs/alert-api.config';
import { ConfigModule } from '@nestjs/config';
import { ImportAlertHttpController } from './features/import-alert/import-alert.http.controller';
import { ImportAlertService } from './features/import-alert/import-alert.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor, ExceptionInterceptor } from 'libs/application';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestContextModule } from 'nestjs-request-context';
import { CqrsModule } from '@nestjs/cqrs';
import { ImportAlertJobController } from './features/import-alert/import-alert.job.controller';

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

const httpControllers = [ImportAlertHttpController];

const commandHandlers: Provider[] = [ImportAlertService];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/tv-alert-onboarding/.env',
      load: [alertApiConfig],
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    ClientsModule.register([
      {
        name: 'ALERT_ONBOARDING_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'alert',
            brokers: ['broker:29092'],
          },
          consumer: {
            groupId: 'alert-consumer',
          },
        },
      },
    ]),
    ScheduleModule.forRoot(),
    RequestContextModule,
    CqrsModule,
  ],
  controllers: [...httpControllers],
  providers: [
    ...interceptors,
    ...commandHandlers,
    Logger,
    ImportAlertService,
    ImportAlertJobController,
  ],
})
export class TvAlertOnboardingModule {}
