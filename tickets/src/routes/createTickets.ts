import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@idea-holding/common';
import { Ticket } from '../database/models/ticket.model';

const router = express.Router();

router.post(
  '/api/v1/tickets/createticket',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    console.log(ticket);

    await ticket.save();
    // res.sendStatus(201).send(ticket);
    res.status(201).send(ticket);
  }
);

export { router as createTicketsRouter };
