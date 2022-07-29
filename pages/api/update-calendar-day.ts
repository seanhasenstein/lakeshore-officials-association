import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { calendar, user } from '../../db';
import { Request, User } from '../../interfaces';
import database from '../../middleware/db';

interface RouteRequest extends Request {
  body: {
    user: User;
    dateString: string;
    status: 'available' | 'unavailable';
  };
}

const router = createRouter<RouteRequest, NextApiResponse>();

router.use(database).post(async (req, res) => {
  const { _id, ...userWithoutId } = req.body.user;
  const updateResult = await calendar.updateCalendarDay(
    req.db,
    req.body.user._id,
    req.body.dateString,
    req.body.status
  );

  // update users updatedAt
  await user.updateUser(req.db, _id, {
    ...userWithoutId,
    updatedAt: new Date().toISOString(),
  });

  res.json(updateResult);
});

export default router.handler({
  onError: (err: any, req, res) => {
    res.status(500).end('Internal server error. Please try again.');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page not found');
  },
});
