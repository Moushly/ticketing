import express from 'express';
import 'express-async-errors';
import { createOrderRouter } from './routes/createOrders';
import { orderByIdRouter } from './routes/getOrderById';
import { ordersRouter } from './routes/getOrders';
import { deleteOrderRouter } from './routes/deleteOrder';
import { errorHandler, NotFoundError, currentUser } from '@idea-holding/common';

import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(orderByIdRouter);
app.use(createOrderRouter);
app.use(ordersRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
