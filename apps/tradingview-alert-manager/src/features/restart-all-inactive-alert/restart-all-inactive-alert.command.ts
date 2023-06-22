import { AggregateId } from 'libs/ddd/aggregate-id';

export class RestartAllInactiveAlertCommand {
  constructor(public readonly aggregateId: AggregateId) {}
}
