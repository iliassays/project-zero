import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { AggregateId } from 'libs/ddd/aggregate-id';

export class RestartInactiveAlertRequestDto {
  @ApiProperty({ example: 'France', description: 'Country of residence' })
  @IsUUID('4')
  aggregateId: AggregateId;
}
