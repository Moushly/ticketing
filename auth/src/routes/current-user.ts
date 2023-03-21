import express from 'express';

import { currentUser } from '@idea-holding/common';

const router = express.Router();

router.get('/api/v1/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
