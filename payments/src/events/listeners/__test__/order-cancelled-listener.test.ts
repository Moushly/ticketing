import { OrderCancelleldEvent, OrderStatus } from '@idea-holding/common';
import { Order } from '../../../database/models/order.model';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: global.createId(),
    price: 200,
    version: 0,
    userId: global.createId(),
    status: OrderStatus.Created,
  });
  await order.save();

  const data: OrderCancelleldEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: global.createId(),
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('Update the status of the order', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message ', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
