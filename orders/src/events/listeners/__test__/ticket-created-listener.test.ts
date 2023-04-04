import { TicketCreatedEvent } from '@idea-holding/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../database/models/ticket.model';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake event
  const data: TicketCreatedEvent['data'] = {
    id: global.createId(),
    version: 0,
    title: 'Match',
    price: 1000,
    userId: global.createId(),
  };
  // create a fake msg object 'Message'
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create and save a ticket', async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with data object + msg obj
  await listener.onMessage(data, msg);
  // write assertions to make sure a ticket where created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with data object + msg obj
  await listener.onMessage(data, msg);
  // write assertion to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
