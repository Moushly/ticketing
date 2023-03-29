import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if the provided id do not exists', async () => {
  await request(app)
    .put(`/api/v1/tickets/updateticket/${global.createId()}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ticket 200',
      price: 400,
    })
    .expect(404);
});

it('return 401 if the user is not authenticated', async () => {
  await request(app)
    .put(`/api/v1/tickets/updateticket/${global.createId()}`)
    .send({
      title: 'ticket 200',
      price: 400,
    })
    .expect(401);
});

it('returns 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', global.signin())
    .send({
      title: 'ticket 400',
      price: 400,
    });

  await request(app)
    .put(`/api/v1/tickets/updateticket/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ticket 500',
      price: 500,
    })
    .expect(401);
});

it('returns 400 if the user provides an invalid title or price ', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', cookie)
    .send({
      title: 'ticket 400',
      price: 400,
    });

  await request(app)
    .put(`/api/v1/tickets/updateticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 450,
    })
    .expect(400);

  await request(app)
    .put(`/api/v1/tickets/updateticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'ticket 10',
      price: -10,
    })
    .expect(400);
});

it('update the ticket provided valid inputs ', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', cookie)
    .send({
      title: 'ticket 400',
      price: 400,
    });

  await request(app)
    .put(`/api/v1/tickets/updateticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'ticket 500',
      price: 500,
    })
    .expect(200);

  const ticketResponse = await request(app).get(`/api/v1/tickets/${response.body.id}`).send();

  expect(ticketResponse.body.title).toEqual('ticket 500');
  expect(ticketResponse.body.price).toEqual(500);
});

it('Publishes an Event ', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/v1/tickets/createticket')
    .set('Cookie', cookie)
    .send({
      title: 'ticket 400',
      price: 400,
    });

  await request(app)
    .put(`/api/v1/tickets/updateticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'ticket 500',
      price: 500,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
