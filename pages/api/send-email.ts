import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { BulkEmailGroup, Request, SendEmailFormValues } from '../../interfaces';
import auth from '../../middleware/auth';
import database from '../../middleware/db';
import { user as userModel } from '../../db';
import { sendEmail } from '../../utils/mailgun';
import { createIdNumber } from '../../utils/misc';

interface RequestBody extends Omit<SendEmailFormValues, 'group'> {
  group: BulkEmailGroup;
}

interface RouteRequest extends Request {
  body: RequestBody;
}

const router = createRouter<RouteRequest, NextApiResponse>();

router
  .use(auth)
  .use(database)
  .post(async (req, res) => {
    const user = await userModel.getUserByEmail(
      req.db,
      req.body.user.email || ''
    );

    const email = {
      id: createIdNumber(),
      user: {
        ...req.body.user,
        name: user ? `${user.firstName} ${user.lastName}` : undefined,
      },
      subject: req.body.subject.trim(),
      body: req.body.body.trim(),
    };

    let usersToEmail: { name: string; email: string }[];
    const group = req.body.group;

    if (group === 'All') {
      const usersData = await userModel.getUsers(req.db);
      usersToEmail = usersData.map(user => {
        return {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        };
      });
    } else {
      const usersData = await userModel.getUsersForSingleSport(req.db, group);
      usersToEmail = usersData.map(user => ({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      }));
    }

    for (const userToEmail of usersToEmail) {
      await sendEmail({
        to: `${userToEmail.name}<${userToEmail.email}>`,
        from: 'Lakeshore Officials Association<no-reply@lakeshoreofficials.com>',
        replyTo: email.user.email,
        subject: `${email.subject} [#${email.id}]`,
        text: `${email.body}\n\n\n*This email was sent from ${
          email.user.name
            ? `${email.user.name} (${email.user.email}) from `
            : ''
        }the Lakeshore Officials dashboard.`,
      });
    }

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
