import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../database/models/order.model';
import { Ticket } from '../../database/models/ticket.model';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket do not exist', async () => {
  // const ticketId = global.createId();
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it('returns an error if the ticket is reserved', async () => {
  const ticket = Ticket.build({ id: global.createId(), title: 'new concert', price: 1000 });

  await ticket.save();

  const order = Order.build({
    userId: 'kldasl',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserved the ticket', async () => {
  const ticket = Ticket.build({ id: global.createId(), title: 'concert 2023', price: 3000 });
  await ticket.save();

  await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: global.createId(),
    title: 'new year 2023',
    price: 1000,
  });
  await ticket.save();
  // make a request to creat an order
  const user = global.signin();
  const { body: createdOrder } = await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
