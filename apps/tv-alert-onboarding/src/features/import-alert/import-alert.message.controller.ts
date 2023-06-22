import { Body, Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { match, Result } from 'oxide.ts';
import { ImportAlertRequestDto } from './import-alert.request.dto';
import { ImportAlertCommand } from './import-alert.command';
import { MessagePattern } from '@nestjs/microservices';
import { IdResponse } from '@libs/api/id.response.dto';

@Controller()
export class ImportAlertMessageController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {
    this.logger.log('Initiated', ImportAlertMessageController.name);
  }

  @MessagePattern('com.project-rero.import-alert')
  async create(message: ImportAlertRequestDto): Promise<IdResponse> {
    const command = new ImportAlertCommand(message.aggregateId);

    const id = await this.commandBus.execute(command);

    return new IdResponse(id.unwrap());
  }
}
