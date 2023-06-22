import { AggregateId } from 'libs/ddd/aggregate-id';

export class ImportAlertCommand {
  constructor(public readonly aggregateId: AggregateId) {}
}
