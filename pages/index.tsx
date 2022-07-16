import { GetServerSideProps } from 'next';
import { connectToDb, user } from '../db';

import FullLayout from '../components/FullLayout';
import { User } from '../interfaces';

export const getServerSideProps: GetServerSideProps = async () => {
  const db = await connectToDb();
  const users = await user.getAllUsersSeparatedBySport(db);
  return { props: { users } };
};

type Props = {
  users: User[];
};

export default function Home(props: Props) {
  return (
    <FullLayout>
      <pre>{JSON.stringify(props.users, null, 2)}</pre>
    </FullLayout>
  );
}
