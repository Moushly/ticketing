import { Publisher, Subjects, OrderCancelleldEvent } from '@idea-holding/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelleldEvent> {
  readonly subject = Subjects.OrderCancelled;
}
