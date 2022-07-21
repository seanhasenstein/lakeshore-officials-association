import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { FormikHelpers } from 'formik';
import styled from 'styled-components';
import { ProfileFormValues, User } from '../interfaces';
import FullLayout from '../components/layouts/FullLayout';
import ProfileForm from '../components/forms/ProfileForm';
import { formatFormValuesForDb } from '../utils/profile';

const initialValues: ProfileFormValues = {
  firstName: '',
  lastName: '',
  city: '',
  homePhone: '',
  cellPhone: '',
  workPhone: {
    number: '',
    extension: '',
  },
  email: '',
  sports: [
    { name: 'Baseball', level: 'default' },
    { name: 'Basketball', level: 'default' },
    { name: 'Football', level: 'default' },
    { name: 'Softball', level: 'default' },
    { name: 'Volleyball', level: 'default' },
  ],
};

export default function CreateProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = React.useState<string>();

  const createProfile = useMutation(
    async (formValues: ProfileFormValues) => {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        body: JSON.stringify(formatFormValuesForDb(formValues)),
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
    values: ProfileFormValues,
    actions: FormikHelpers<ProfileFormValues>
  ) => {
    createProfile.mutate(values, {
      onError: () => {
        actions.setSubmitting(false);
      },
      onSuccess: () => {
        router.push('/profile');
      },
    });
  };

  return (
    <FullLayout title="Create a profile" authRequired={false}>
      <CreateProfileStyles>
        <h2>Create a profile</h2>
        <p>
          Complete this form to create a profile for the Lakeshore Officials.
        </p>
        <ProfileForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          serverError={serverError}
        />
      </CreateProfileStyles>
    </FullLayout>
  );
}

const CreateProfileStyles = styled.div`
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
