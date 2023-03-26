import express, { Request, Response } from 'express';
import { Ticket } from '../database/models/ticket.model';
import { NotFoundError } from '@idea-holding/common';

const router = express.Router();

router.get('/api/v1/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new NotFoundError();

  res.send(ticket);
});

export { router as getTicketByIdRouter };
