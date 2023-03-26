import express from 'express';
import 'express-async-errors';
import { createTicketsRouter } from './routes/createTickets';
import { getTicketByIdRouter } from './routes/getTicketById';
import { getTicketsRouter } from './routes/getTickets';
import { updateTicketRouter } from './routes/updateTicket';
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

app.use(getTicketByIdRouter);
app.use(createTicketsRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
