import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../database/models/ticket.model';
import { OrderCancelleldEvent, OrderStatus } from '@idea-holding/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = global.createId();
  const ticket = Ticket.build({
    title: 'CHE vs MCI',
    price: 200,
    userId: global.createId(),
  });
  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelleldEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, orderId };
};

it('Update the ticke , publishe and event and acks the message ', async () => {
  const { listener, data, msg, ticket, orderId } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
