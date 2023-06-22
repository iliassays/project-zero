import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok } from 'oxide.ts';
import { Logger, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AggregateId } from 'libs/ddd/aggregate-id';
import { ConfigType } from '@nestjs/config';
import { ImportAlertCommand } from './import-alert.command';
import alertApiConfig from '../../configs/alert-api.config';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { SignalProps } from './import-alert.types';
import { SignalServiceError } from '../../domain/onboarding.errors';

@CommandHandler(ImportAlertCommand)
export class ImportAlertService implements ICommandHandler<ImportAlertCommand> {
  private readonly trade_signal_topic: string = 'project-zero.trade-signals';

  constructor(
    private readonly logger: Logger,
    @Inject('ALERT_ONBOARDING_SERVICE')
    private readonly kafkaClient: ClientKafka,
    @Inject(alertApiConfig.KEY)
    private tvConfig: ConfigType<typeof alertApiConfig>,
    private readonly httpService: HttpService,
  ) {
    this.logger.log('Initiated', ImportAlertService.name);
  }

  async execute(
    command: ImportAlertCommand,
  ): Promise<Result<AggregateId, Error>> {
    this.logger.log('fetching alerts...', ImportAlertService.name);

    const signals = await this.extractSignals();

    this.logger.log(
      `fetched alerts count...${signals.length}`,
      ImportAlertService.name,
    );

    this.kafkaClient.emit(this.trade_signal_topic, JSON.stringify(signals));

    return Ok(command.aggregateId);
  }

  extractSignals = async (): Promise<SignalProps[]> => {
    this.logger.log(
      `fetched alerts from... ${this.tvConfig.url}`,
      ImportAlertService.name,
    );
    const { data } = await firstValueFrom(
      this.httpService.get<SignalProps[]>(this.tvConfig.url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw new SignalServiceError(error);
        }),
      ),
    );

    return data;
  };
}
