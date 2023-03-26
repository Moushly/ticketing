import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('return a 404 if the ticket is not found', async () => {
  await request(app).get(`/api/v1/tickets/${global.createId()}`).send({}).expect(404);
});

it('return the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20;

  const resp = await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/v1/tickets/${resp.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
