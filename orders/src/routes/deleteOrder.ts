import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@idea-holding/common';
import { Order } from '../database/models/order.model';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/v1/orders/deleteorder/:orderid',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderid } = req.params;
    const order = await Order.findById(orderid).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    // Publish an Event that the order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
