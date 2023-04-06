import { OrderCreatedEvent, OrderStatus } from '@idea-holding/common';
import { Order } from '../../../database/models/order.model';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: global.createId(),
    version: 0,
    expiresAt: 'dadas',
    userId: global.createId(),
    status: OrderStatus.Created,
    ticket: {
      id: global.createId(),
      price: 10,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('Replicate the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  listener.onMessage(data, msg);
  msg.ack();
  expect(msg.ack).toHaveBeenCalled();
});