import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { match, Result } from 'oxide.ts';
import { ImportAlertCommand } from './import-alert.command';

@Injectable()
export class ImportAlertJobController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {
    this.logger.log(
      'ImportAlertJobController Initiated',
      ImportAlertJobController.name,
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.log('Called every minute.');

    const aggregateId = uuidv4();
    this.logger.log(aggregateId);
    const command = new ImportAlertCommand(aggregateId);

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
