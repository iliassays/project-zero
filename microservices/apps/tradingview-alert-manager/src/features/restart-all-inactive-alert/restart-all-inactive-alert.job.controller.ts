import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RestartAllInactiveAlertCommand } from './restart-all-inactive-alert.command';
import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { match, Result } from 'oxide.ts';

@Injectable()
export class RestartAllInactiveAlertJobController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {
    this.logger.log(
      'RestartAllInactiveAlertJobController Initiated',
      RestartAllInactiveAlertJobController.name,
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Called every minute.');

    const aggregateId = uuidv4();
    this.logger.debug(aggregateId);
    const command = new RestartAllInactiveAlertCommand(aggregateId);

    const result: Result<string, Error> = await this.commandBus.execute(
      command,
    );

    match(result, {
      Ok: (id: string) =>
        this.logger.log(`Job successfully eecuted with: ${id}`),
      Err: (error: Error) => {
        this.logger.error(`Job failed with error:: ${error.message}`);
      },
    });
  }
}
