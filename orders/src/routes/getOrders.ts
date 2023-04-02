import express, { Request, Response } from 'express';
import { requireAuth } from '@idea-holding/common';
import { Order } from '../database/models/order.model';

const router = express.Router();

router.get('/api/v1/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');
  res.send(orders);
});

export { router as ordersRouter };
