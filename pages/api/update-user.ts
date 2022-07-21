import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { user } from '../../db';
import { ProfileFormValues, Request } from '../../interfaces';
import database from '../../middleware/db';

interface RouteRequest extends Request {
  body: {
    _id: string;
    formValues: ProfileFormValues;
  };
}

const router = createRouter<RouteRequest, NextApiResponse>();

router.use(database).post(async (req, res) => {
  const updatedUser = await user.updateUser(
    req.db,
    req.body._id,
    req.body.formValues
  );
  res.json(updatedUser);
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
