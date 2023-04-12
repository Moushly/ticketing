import request from 'supertest';
import { app } from '../../app';

it('response with details about current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/v1/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('Response with null if not autenticated', async () => {
  const response = await request(app).get('/api/v1/users/currentuser').send().expect(200);
  expect(response.body.currentUser).toEqual(null);
});
