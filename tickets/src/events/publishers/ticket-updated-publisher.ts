import { Publisher, Subjects, TicketUpdatedEvent } from '@idea-holding/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
