import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@idea-holding/common';
import { Order } from '../database/models/order.model';
import { stripe } from '../stripe';
import { Payment } from '../database/models/payment.model';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/v1/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('A valid Token is missing'),
    body('orderId').not().isEmpty().withMessage('A order id is needed'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    if (order.status === OrderStatus.Cancelled) throw new BadRequestError('order was cancelled');

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as paymentRouter };
