import { validateRequest, BadRequestError } from '@idea-holding/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../database/models/user.model';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post(
  '/api/v1/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError('Invalid credentials 🤪');

    const passwordMatch = await Password.compare(existingUser.password, password);
    if (!passwordMatch) throw new BadRequestError('Invalid Credentials 😛');

    // generate JWT
    const existingUserJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    // store in the session object
    req.session = {
      jwt: existingUserJWT,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
