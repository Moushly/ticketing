import { Order } from '../../database/models/order.model';
import request from 'supertest';
import { app } from '../../app';
import { OrderStatus } from '@idea-holding/common';
import { stripe } from '../../stripe';
import { Payment } from '../../database/models/payment.model';

// jest.mock('../../stripe');

it('returns a 404 when purchasing an order that not exist', async () => {
  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'dadajsdas',
      orderId: global.createId(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that do not belong to the user', async () => {
  const createdOrder = Order.build({
    id: global.createId(),
    userId: global.createId(),
    version: 0,
    price: 1000,
    status: OrderStatus.Created,
  });

  await createdOrder.save();

  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'dadajsdas',
      orderId: createdOrder.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing an cancel order', async () => {
  const userId = global.createId();

  const createdOrder = Order.build({
    id: global.createId(),
    userId: userId,
    version: 0,
    price: 1000,
    status: OrderStatus.Cancelled,
  });
  await createdOrder.save();

  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'dadajsdas',
      orderId: createdOrder.id,
    })
    .expect(400);
});

it('returns 204 with valid input ', async () => {
  const userId = global.createId();
  const price = Math.floor(Math.random() * 100000);

  const createdOrder = Order.build({
    id: global.createId(),
    userId: userId,
    version: 0,
    price: price,
    status: OrderStatus.Created,
  });
  await createdOrder.save();

  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: createdOrder.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  const payment = await Payment.findOne({
    orderId: createdOrder.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
