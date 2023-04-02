import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../database/models/ticket.model';
import { Order, OrderStatus } from '../../database/models/order.model';

it('marks and order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'new year 2023',
    price: 1000,
  });
  await ticket.save();
  // make a request to creat an order
  const user = global.signin();
  const { body: createdOrder } = await request(app)
    .post('/api/v1/orders/createorder')
    .set('Cookie', user)
    .send({ ticketId: ticket.id });

  console.log(createdOrder);

  // cancelling the order
  const { body: cancelledOrder } = await request(app)
    .delete(`/api/v1/orders/deleteorder/${createdOrder.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  console.log(cancelledOrder);

  // expectaion
  const updatedorder = await Order.findById(createdOrder.id);
  expect(updatedorder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits an error cancelled event ');
