import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { format, utcToZonedTime } from 'date-fns-tz';
import { sendEmail } from '../../utils/mailgun';
import {
  createIdNumber,
  formatPhoneNumber,
  removeNonDigits,
} from '../../utils/misc';

interface RouteRequest extends NextApiRequest {
  body: {
    fullname: string;
    subject: 'account' | 'bug' | 'other';
    customSubject: string;
    email: string;
    phone: string;
    message: string;
  };
}

const router = createRouter<RouteRequest, NextApiResponse>();

router.post(async (req, res) => {
  const messageId = createIdNumber();
  const form = {
    name: req.body.fullname.trim(),
    subject:
      req.body.subject === 'account'
        ? 'New account request'
        : req.body.subject === 'bug'
        ? 'Website bug report'
        : req.body.customSubject.trim(),
    email: req.body.email.toLowerCase().trim(),
    phone: removeNonDigits(req.body.phone),
    message: req.body.message.trim(),
  };
  const zonedTime = utcToZonedTime(new Date(), 'America/Chicago');

  const result = await sendEmail({
    // TODO: enter a real email address for production
    to: 'seanhasenstein+lakeshore-officials@gmail.com',
    from: 'Lakeshore Officials<admin@lakeshoreofficials.com>',
    replyTo: req.body.email,
    subject: `${form.subject} [#${messageId}]`,
    text: `Contact Lakeshore Officials Admin\n\nMessage #: ${messageId}\nTimestamp: ${format(
      zonedTime,
      "MMM. do, yyyy 'at' h:mm aa"
    )}\n\nSubject: ${form.subject}\nName: ${form.name}\nEmail: ${form.email}${
      form.phone ? `\nPhone: ${formatPhoneNumber(form.phone)}` : ''
    }\n\nMessage:\n${form.message}
  `,
  });

  console.log(result);

  res.json({ success: true });
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
