import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { user } from '../../db';
import { Request, User } from '../../interfaces';
import database from '../../middleware/db';
import auth from '../../middleware/auth';

interface RouteRequest extends Request {
  query: {
    _id?: string;
    email?: string;
  };
}

const router = createRouter<RouteRequest, NextApiResponse<User>>();

router
  .use(auth)
  .use(database)
  .get(async (req, res) => {
    if (!req.query.email && !req.query._id) {
      throw new Error(
        "An email or _id query param is required but wasn't provided"
      );
    }

    if (req.query.email) {
      const userResult = await user.getUserByEmail(req.db, req.query.email);
      res.json(userResult);
      return;
    }

    if (req.query._id) {
      const userResult = await user.getUserById(req.db, req.query._id);
      res.json(userResult);
      return;
    }
  });

export default router.handler({
  onError: (err, _req, res) => {
    console.error(err);
    res.status(500).end('Internal server error');
  },
  onNoMatch: (_req, res) => {
    res.status(404).end('Page not found');
  },
});
