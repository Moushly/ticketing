import { Listener, OrderStatus, OrderCreatedEvent, Subjects } from '@idea-holding/common';
import { Order } from '../../database/models/order.model';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      version: data.version,
      userId: data.userId,
    });

    await order.save();

    msg.ack();
  }
}
