import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../database/models/order.model';
import { Ticket } from '../../database/models/ticket.model';
import mongoose from 'mongoose';

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
  const ticket = Ticket.build({ title: 'new concert', price: 1000 });

  await ticket.save();

  const order = Order.build({
    userId: 'kldasl',
    status: OrderStatus.Created,
    expireAt: new Date(),
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
  const ticket = Ticket.build({ title: 'concert 2023', price: 3000 });
  await ticket.save();

  await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo('emits an order created event');
