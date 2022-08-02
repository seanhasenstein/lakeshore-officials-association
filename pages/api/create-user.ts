import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { user } from '../../db';
import { ProfileFormValues, Request, User } from '../../interfaces';
import database from '../../middleware/db';
import auth from '../../middleware/auth';

interface RouteRequest extends Request {
  body: ProfileFormValues;
}

const router = createRouter<RouteRequest, NextApiResponse<User>>();

router
  .use(auth)
  .use(database)
  .post(async (req, res) => {
    const email = req.body.email.toLowerCase().trim();

    // check if email is already connected to an account
    const userWithEmailAlreadyExists = await user.getUserByEmail(req.db, email);
    if (userWithEmailAlreadyExists) {
      res.status(500).end(`An account already exists with ${email}`);
      return;
    }

    const timestamp = new Date().toISOString();

    // create the user
    const userResult = await user.createUser(req.db, {
      ...req.body,
      isAdmin: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    res.json(userResult);
  });

export default router.handler({
  onError: (err: any, req, res) => {
    if (err.code && err.code === 11000) {
      res
        .status(500)
        .end(`An account already exists with ${err.keyValue?.email}.`);
      return;
    }

    res.status(500).end('Internal server error. Please try again.');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page not found');
  },
});
