import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@idea-holding/common';
import { Order } from '../database/models/order.model';
import express, { Request, Response } from 'express';

const router = express.Router();

router.delete(
  '/api/v1/orders/deleteorder/:orderid',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderid } = req.params;
    const order = await Order.findById(orderid);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    // Publish an Event that the order was cancelled

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
