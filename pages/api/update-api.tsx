import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { user } from '../../db';
import { Request } from '../../interfaces';
import database from '../../middleware/db';
import auth from '../../middleware/auth';

const router = createRouter<Request, NextApiResponse>();

router
  .use(auth)
  .use(database)
  .get(async (req, res) => {
    const allUsers = await user.getUsers(req.db);

    // TODO: delete this file...
    // for (const currentUser of allUsers) {}

    // const results = await user.getUsers(req.db);

    res.json({ allUsers });
  });

export default router.handler({
  onError: (err: any, req, res) => {
    if (err.code && err.code === 11000) {
      res
        .status(500)
        .end(`An account already exists with ${err.keyValue?.email}`);
      return;
    }

    res.status(500).end('Internal server error. Please try again.');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page not found');
  },
});
