import request from 'supertest';

import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return await request(app)
    .post('/api/v1/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass1234',
    })
    .expect(201);
});

it('returns 400 with invalid Email', async () => {
  return await request(app)
    .post('/api/v1/users/signup')
    .send({
      email: 'dadbasd',
      password: 'pass1234',
    })
    .expect(400);
});

it('returns 400 with invalid password', async () => {
  return await request(app)
    .post('/api/v1/users/signup')
    .send({
      email: 'dadbasd',
      password: 'p',
    })
    .expect(400);
});

it('returns 400 with missing email and password', async () => {
  await request(app).post('/api/v1/users/signup').send({ email: 'test@test.com' }).expect(400);
  await request(app).post('/api/v1/users/signup').send({ password: 'pass1234' }).expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/v1/users/signup')
    .send({
      email: 'test1@test.com',
      password: 'pass1234',
    })
    .expect(201);
  await request(app)
    .post('/api/v1/users/signup')
    .send({
      email: 'test1@test.com',
      password: 'pass1234',
    })
    .expect(400);
});

it('set a cookie after succeful signup', async () => {
  const response = await request(app)
    .post('/api/v1/users/signup')
    .send({
      email: 'test2@test.com',
      password: 'pass1234',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
