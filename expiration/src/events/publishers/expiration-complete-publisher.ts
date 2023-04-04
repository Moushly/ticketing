import { Subjects, Publisher, ExpirationCompleteEvent } from '@idea-holding/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
