import { NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { Request } from '../interfaces';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export default async function auth(
  req: Request,
  res: NextApiResponse,
  next: () => void
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    return next();
  } else {
    res.status(401).json({ message: 'unauthorized' });
    return;
  }
}
