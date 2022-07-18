import { GetServerSideProps } from 'next';
import { connectToDb, user } from '../db';

import { useQuery } from 'react-query';
import { UsersBySports } from '../interfaces';
import { fetchUsersBySport } from '../utils/queries';
import FullLayout from '../components/FullLayout';

export const getServerSideProps: GetServerSideProps = async () => {
  const db = await connectToDb();
  const usersBySports = await user.getUsersBySports(db);
  return { props: { usersBySports } };
};

type Props = {
  usersBySports: UsersBySports;
};

export default function Home(props: Props) {
  useQuery(['users', 'baseball'], () => fetchUsersBySport('Baseball'), {
    initialData: props.usersBySports.Baseball,
    staleTime: 1000 * 60 * 5,
  });
  useQuery(['users', 'basketball'], () => fetchUsersBySport('Basketball'), {
    initialData: props.usersBySports.Basketball,
    staleTime: 1000 * 60 * 5,
  });
  useQuery(['users', 'football'], () => fetchUsersBySport('Football'), {
    initialData: props.usersBySports.Football,
    staleTime: 1000 * 60 * 5,
  });
  useQuery(['users', 'softball'], () => fetchUsersBySport('Softball'), {
    initialData: props.usersBySports.Softball,
    staleTime: 1000 * 60 * 5,
  });
  useQuery(['users', 'volleyball'], () => fetchUsersBySport('Volleyball'), {
    initialData: props.usersBySports.Volleyball,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <FullLayout>
      <h2>This is the homepage</h2>
    </FullLayout>
  );
}
