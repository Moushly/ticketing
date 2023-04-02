import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../database/models/ticket.model';

it('fetches the order by id', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'isk Consert',
    price: 1000,
  });
  await ticket.save();

  // make a response to build an order with the ticket
  const user = global.signin();
  const { body: orderCreated } = await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    });

  // make a request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/v1/orders/${orderCreated.id}`)
    .set('Cookie', user)
    .send();

  expect(fetchedOrder.id).toEqual(orderCreated.id);
});

it('returns an Error if a user fetch another user orders', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'isk Consert',
    price: 1000,
  });
  await ticket.save();

  // make a response to build an order with the ticket
  const user = global.signin();
  const { body: orderCreated } = await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    });

  // make a request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/v1/orders/${orderCreated.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
