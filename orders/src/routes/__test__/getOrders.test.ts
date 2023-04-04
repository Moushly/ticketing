import request from 'supertest';
import { app } from '../../app';

import { Order } from '../../database/models/order.model';
import { Ticket } from '../../database/models/ticket.model';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: global.createId(),
    title: 'concert',
    price: 200,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for an particulare user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();
  const user1 = global.signin();
  const user2 = global.signin();
  // Create one order as User 1
  await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', user1)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as User 2
  const { body: order1 } = await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', user2)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', user2)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request for User 2
  const response = await request(app).get('/api/v1/orders').set('Cookie', user2).expect(200);

  //   expect(response.body.orders[0].id).toEqual(order1.order.id);
  //   expect(response.body.orders.length).toEqual(2);
});
