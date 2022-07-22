import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { user } from '../../db';
import { Request, User } from '../../interfaces';
import database from '../../middleware/db';

interface RouteRequest extends Request {
  query: {
    email: string;
  };
}

const router = createRouter<RouteRequest, NextApiResponse<User>>();

router.use(database).get(async (req, res) => {
  const userResult = await user.getUser(req.db, req.query.email);
  res.json(userResult);
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
