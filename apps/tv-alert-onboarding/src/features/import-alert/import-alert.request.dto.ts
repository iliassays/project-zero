import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { AggregateId } from 'libs/ddd/aggregate-id';

export class ImportAlertRequestDto {
  @ApiProperty({
    example: '0019dd26-b47c-4eb5-9c14-2a86dde2f393',
    description: 'AggregateId',
  })
  @IsUUID('4')
  aggregateId: AggregateId;
}
