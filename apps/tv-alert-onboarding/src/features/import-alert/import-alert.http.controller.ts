import { ApiErrorResponse } from '@libs/api/api-error.response';
import { IdResponse } from '@libs/api/id.response.dto';
import { Body, Controller, Logger, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { match, Result } from 'oxide.ts';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ImportAlertRequestDto } from './import-alert.request.dto';
import { ImportAlertCommand } from './import-alert.command';

@Controller('alert-onboarding')
export class ImportAlertHttpController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {
    this.logger.log('Initiated', ImportAlertHttpController.name);
  }

  @ApiOperation({ summary: 'Import alert request ' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post('import')
  async import(@Body() body: ImportAlertRequestDto): Promise<IdResponse> {
    const command = new ImportAlertCommand(body.aggregateId);

    const result: Result<string, Error> = await this.commandBus.execute(
      command,
    );

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
