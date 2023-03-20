import request from 'supertest';

import { app } from '../../app';

it('Clear the cookie after signout', async () => {
  await request(app)
    .post('/api/v1/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pass1234',
    })
    .expect(201);

  const response = await request(app).post('/api/v1/users/signout').send({}).expect(200);
  expect(response.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
