import React from 'react';
import { useRouter } from 'next/router';
import { FormikHelpers } from 'formik';
import styled from 'styled-components';
import { ProfileFormValues } from '../interfaces';
import { formatDbValuesForForm, formatFormValuesForDb } from '../utils/profile';
import { useUser } from '../hooks/useUser';
import useUpdateProfile from '../hooks/useUpdateProfile';
import FullLayout from '../components/layouts/FullLayout';
import ProfileForm from '../components/forms/ProfileForm';
import ServerError from '../components/ServerError';

export default function UpdateProfile() {
  const router = useRouter();
  const user = useUser();
  const { updateProfile, serverError } = useUpdateProfile();

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
          router.push('/');
        },
      }
    );
  };

  return (
    <FullLayout title="Update profile" authRequired={true}>
      <UpdateProfileStyles>
        {user.isLoading ? 'Loading...' : null}
        {user.isError ? <ServerError /> : null}
        {user.data && (
          <>
            <h2>Update your profile</h2>
            <p>Use this form to update any information that has changed.</p>
            <ProfileForm
              initialValues={formatDbValuesForForm(user.data)}
              onSubmit={onSubmit}
              serverError={serverError}
            />
          </>
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
    margin: 1rem 0 0;
    max-width: 36rem;
    width: 100%;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;
  }
`;
