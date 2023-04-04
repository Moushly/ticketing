import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from '@idea-holding/common';

import mongoose from 'mongoose';
import { Ticket } from '../database/models/ticket.model';
import { Order, OrderStatus } from '../database/models/order.model';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/v1/orders/createorder',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket that the user want to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not reserved
    // Run Query to look All Orders --> is the ticket is

    const isTicketReserved = await ticket.isReserved();
    if (isTicketReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    //calculate an experation date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it in DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expireAt: expiration,
      ticket,
    });
    await order.save();
    // Publish an Event that the order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expireAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
