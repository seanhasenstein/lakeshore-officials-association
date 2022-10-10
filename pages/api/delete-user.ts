import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { user } from '../../db';
import { ProfileFormValues, Request } from '../../interfaces';
import database from '../../middleware/db';
import auth from '../../middleware/auth';

interface RouteRequest extends Request {
  body: {
    _id: string;
    formValues: ProfileFormValues;
  };
}

const router = createRouter<RouteRequest, NextApiResponse>();

router
  .use(auth)
  .use(database)
  .post(async (req, res) => {
    await user.deleteUser(req.db, req.body._id);
    res.json({ success: true });
  });

export default router.handler({
  onError: (err: any, req, res) => {
    res.status(500).end('Internal server error. Please try again.');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page not found');
  },
});
