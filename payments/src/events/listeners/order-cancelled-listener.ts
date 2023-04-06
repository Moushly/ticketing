import { Listener, Subjects, OrderCancelleldEvent, OrderStatus } from '@idea-holding/common';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../database/models/order.model';
import { Message } from 'node-nats-streaming';

export class OrderCancelledListener extends Listener<OrderCancelleldEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelleldEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) throw new Error('Order Not Found');

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
