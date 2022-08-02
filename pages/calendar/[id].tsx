import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import DirectoryProfile from '../../components/DirectoryProfile';
import FullLayout from '../../components/layouts/FullLayout';
import { getUrlParam } from '../../utils/misc';
import { fetchUserById } from '../../utils/queries';
import { User } from '../../interfaces';

export default function OfficialCalendar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [id, setId] = React.useState<string>();

  const userQuery = useQuery(
    ['users', 'user', id],
    () => fetchUserById(getUrlParam(id)),
    {
      initialData: () => {
        const users = queryClient.getQueryData<User[]>([
          'users',
          'sports',
          getUrlParam(router.query.s),
        ]);
        if (users) {
          return users.find(u => u._id === id);
        }
      },
      staleTime: 1000 * 60 * 5,
    }
  );

  React.useEffect(() => {
    if (router.query.id) {
      setId(getUrlParam(router.query.id));
    }
  }, [router.query.id]);

  return (
    <FullLayout
      title={
        userQuery.data
          ? `${userQuery.data.firstName} ${userQuery.data.lastName}`
          : ''
      }
      authRequired={true}
    >
      <DirectoryProfile userQuery={userQuery} />
    </FullLayout>
  );
}
