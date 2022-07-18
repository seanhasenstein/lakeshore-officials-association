import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { user } from '../../db';
import { ProfileFormValues, Request, User } from '../../interfaces';
import database from '../../middleware/db';

interface RouteRequest extends Request {
  body: ProfileFormValues;
}

const router = createRouter<RouteRequest, NextApiResponse<User>>();

router.use(database).post(async (req, res) => {
  const userResult = await user.createUser(req.db, req.body);
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
