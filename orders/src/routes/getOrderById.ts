import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@idea-holding/common';
import { Order } from '../database/models/order.model';

const router = express.Router();

router.get('/api/v1/orders/:orderid', requireAuth, async (req: Request, res: Response) => {
  // we need to validate the req.params.orderId to be a valid mongodb id
  const order = await Order.findById(req.params.orderid).populate('ticket');
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export { router as orderByIdRouter };
