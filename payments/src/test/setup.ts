import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
  var createId: () => string;
}

jest.mock('../nats-wrapper');
process.env.STRIPE_KEY =
  'sk_test_51IwpxzIQJfF9sHueDz43siEh20ulfXzpwusYFgbfjtG92xi92KTHcuO3B33sRTeH3Vz7c2JhGaRjY96WRJ1xKgK700ciCIRvhu';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // build a JWT paylod {id,email}
  const payload = {
    id: id || global.createId(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object {jwt:MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take the JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};

global.createId = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  return id;
};
