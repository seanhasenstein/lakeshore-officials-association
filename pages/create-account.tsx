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

export default function CreateAccount() {
  const router = useRouter();
  const user = useUser();
  const { updateProfile, serverError } = useUpdateProfile();

  const onSubmit = (
    values: ProfileFormValues,
    actions: FormikHelpers<ProfileFormValues>
  ) => {
    if (!user.data) return;
    updateProfile.mutate(
      { _id: user.data._id, formValues: formatFormValuesForDb(values) },
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
    <FullLayout title="Create a profile" authRequired={true}>
      <CreateAccountStyles>
        <h2>Create your account</h2>
        <p>
          Complete this form to create your account for the Lakeshore Officials
          Association website.
        </p>
        {user.data && (
          <ProfileForm
            initialValues={formatDbValuesForForm(user.data)}
            onSubmit={onSubmit}
            serverError={serverError}
          />
        )}
        {/* TODO: show error if useUser fails */}
      </CreateAccountStyles>
    </FullLayout>
  );
}

const CreateAccountStyles = styled.div`
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
