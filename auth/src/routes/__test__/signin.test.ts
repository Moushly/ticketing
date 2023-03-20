import request from 'supertest';

import { app } from '../../app';

it('fails when a email does not exist is supplied', async () => {
  return await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pass1234',
    })
    .expect(400);
});

it('fails when an incorrect password supplied', async () => {
  await request(app)
    .post('/api/v1/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass1234',
    })
    .expect(201);

  await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pass12345',
    })
    .expect(400);
});

it('response with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/v1/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass1234',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pass1234',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
