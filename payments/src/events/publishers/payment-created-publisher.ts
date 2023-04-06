import { Publisher, PaymentCreatedEvent, Subjects } from '@idea-holding/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
