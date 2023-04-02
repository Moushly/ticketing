import { Publisher, Subjects, OrderCreatedEvent } from '@idea-holding/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
