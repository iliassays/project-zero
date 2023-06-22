import { ApiErrorResponse } from '@libs/api/api-error.response';
import { IdResponse } from '@libs/api/id.response.dto';
import { Body, Controller, Logger, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { match, Result } from 'oxide.ts';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RestartInactiveAlertRequestDto } from './restart-all-inactive-alert.request.dto';
import { RestartAllInactiveAlertCommand } from './restart-all-inactive-alert.command';

@Controller('alert-manager')
export class RestartAllInactiveAlertHttpController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {
    this.logger.log('Initiated', RestartAllInactiveAlertHttpController.name);
  }

  @ApiOperation({ summary: 'Create a trading view alert restart request ' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post()
  async restart(
    @Body() body: RestartInactiveAlertRequestDto,
  ): Promise<IdResponse> {
    const command = new RestartAllInactiveAlertCommand(body.aggregateId);

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
