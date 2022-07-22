import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { FormikHelpers } from 'formik';
import styled from 'styled-components';
import { ProfileFormValues, User } from '../interfaces';
import { formatDbValuesForForm, formatFormValuesForDb } from '../utils/profile';
import { useUser } from '../hooks/useUser';
import FullLayout from '../components/layouts/FullLayout';
import ProfileForm from '../components/forms/ProfileForm';

export default function UpdateProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useUser();
  const [serverError, setServerError] = React.useState<string>();

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

      if (!response.ok) {
        const data = await response.text();
        setServerError(data);
        throw new Error(data);
      }

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
    if (!user.data) return;
    updateProfile.mutate(
      {
        _id: user.data._id,
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
    <FullLayout title="Update profile" authRequired={true}>
      <UpdateProfileStyles>
        <h2>Update your profile</h2>
        <p>Use this form to update any information that has changed.</p>
        {user.data && (
          <ProfileForm
            initialValues={formatDbValuesForForm(user.data)}
            onSubmit={onSubmit}
            serverError={serverError}
          />
        )}
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
