import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../database/models/ticket.model';

import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to api/tickets for post request  ', async () => {
  const response = await request(app).post('/api/v1/tickets/createticket').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user in signed in', async () => {
  await request(app).post('/api/v1/tickets/createticket').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns Error if invalid Title is Provided ', async () => {
  await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns Error if invalid Price in Provided ', async () => {
  await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', global.signin())
    .send({
      title: 'hellooooo',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', global.signin())
    .send({
      title: 'hello',
    })
    .expect(400);
});

it('create a tickets with valid inputs', async () => {
  // add a check to make sure ticket was saved
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', global.signin())
    .send({
      title: 'adasdas',
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
});

it('Publishes an Event ', async () => {
  const title = 'Ramadan';
  await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', global.signin())
    .send({
      title: 'adasdas',
      price: 20,
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
