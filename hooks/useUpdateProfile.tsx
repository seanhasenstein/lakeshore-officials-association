import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ProfileFormValues, User } from '../interfaces';

interface UpdateMutation {
  _id: string;
  formValues: ProfileFormValues;
}

export default function useUpdateProfile() {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = React.useState<string>();

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
        const error = await response.text();
        setServerError(error);
        throw new Error(error);
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

  return { updateProfile, serverError };
}
