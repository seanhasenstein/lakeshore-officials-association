import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FormikHelpers } from 'formik';
import styled from 'styled-components';
import { ProfileFormValues, User } from '../interfaces';
import FullLayout from '../components/FullLayout';
import ProfileForm from '../components/ProfileForm';
import { formatDbValuesForForm, formatFormValuesForDb } from '../utils/profile';
import { fetchUser } from '../utils/queries';

export default function UpdateProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const userQuery = useQuery(
    ['users', 'user', '62d5b7f995ce684579eb9919'],
    () => fetchUser('62d5b7f995ce684579eb9919'),
    { staleTime: 1000 * 60 * 5 }
  );

  interface UpdateMutation {
    _id: string;
    formValues: ProfileFormValues;
  }

  const updateProfile = useMutation(
    async ({ _id, formValues }: UpdateMutation) => {
      const response = await fetch('/api/update-user', {
        method: 'POST',
        body: JSON.stringify({ _id, formValues }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // todo: handle !respsponse.ok or and error message from the api route

      const data: User = await response.json();
      return data;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['users']);
      },
    }
  );

  const onSubmit = (
    formValues: ProfileFormValues,
    actions: FormikHelpers<ProfileFormValues>
  ) => {
    if (!userQuery.data) return;

    updateProfile.mutate(
      {
        _id: userQuery.data._id,
        formValues: formatFormValuesForDb(formValues),
      },
      {
        onError: () => {
          actions.setSubmitting(false);
        },
        onSuccess: () => {
          router.push('/profile');
        },
      }
    );
  };

  return (
    <FullLayout title="Update profile">
      <UpdateProfileStyles>
        <h2>Update your profile</h2>
        <p>Use this form to update any information that has changed.</p>
        {userQuery.isLoading ? 'Loading...' : null}
        {userQuery.isError ? 'An error occurred fetching your profile' : null}
        {userQuery.data ? (
          <ProfileForm
            initialValues={formatDbValuesForForm(userQuery.data)}
            onSubmit={onSubmit}
          />
        ) : null}
      </UpdateProfileStyles>
    </FullLayout>
  );
}

const UpdateProfileStyles = styled.div`
  margin: 0 0 4rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #06080b;
  }

  p {
    margin: 0.5rem 0 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;
  }
`;
