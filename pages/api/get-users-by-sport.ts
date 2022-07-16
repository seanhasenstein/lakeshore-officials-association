import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { user } from '../../db';
import { Request, Sport, User } from '../../interfaces';
import database from '../../middleware/db';

interface RouteRequest extends Request {
  query: {
    sport: Sport;
  };
}

const router = createRouter<RouteRequest, NextApiResponse<User[]>>();

router.use(database).get(async (req, res) => {
  const usersBySports = await user.getUsersForSingleSport(
    req.db,
    req.query.sport
  );
  res.json(usersBySports);
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
