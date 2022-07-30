import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { Request } from '../../interfaces';
import database from '../../middleware/db';
import { calendar } from '../../db';

interface RouteRequest extends Request {
  query: {
    year?: string;
  };
}

const router = createRouter<RouteRequest, NextApiResponse>();

router.use(database).get(async (req, res) => {
  if (req.query.year) {
    const data = await calendar.getYearCalendarData(req.db, req.query.year);

    if (!data) {
      res.json({});
      return;
    }

    res.json(data);
  } else {
    const data = await calendar.getAllCalendarData(req.db);
    res.json(data);
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
