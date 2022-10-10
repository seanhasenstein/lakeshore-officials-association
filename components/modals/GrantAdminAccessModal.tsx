import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { User } from '../../interfaces';
import {
  DialogBackdrop,
  DialogPanelContainer,
  DialogPanelStyles,
} from '../../styles/DialogStyles';
import { LoadingSpinner } from '../../styles/LoadingSpinner';

type Props = {
  user: User;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseFocusItem: React.RefObject<HTMLElement>;
  onMutationSuccess?: () => void;
};

export default function GrantAdminAccessModal(props: Props) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = React.useState(false);

  const grantAdminAccessMutation = useMutation(
    async () => {
      const { _id, ...updatedUser }: User = { ...props.user, isAdmin: true };
      const response = await fetch('/api/update-user', {
        method: 'POST',
        body: JSON.stringify({ _id, formValues: updatedUser }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Internal serve error');
      }

      const data: User = await response.json();
      return data;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['users']);
      },
      onError: () => {
        setServerError(true);
      },
      onSuccess: () => {
        props.setShow(false);
        props.onMutationSuccess && props.onMutationSuccess();
      },
    }
  );

  const handleOnClose = () => {
    props.onCloseFocusItem.current?.focus();
    props.setShow(false);
  };

  return (
    <Dialog open={props.show} onClose={handleOnClose}>
      <DialogBackdrop />
      <DialogPanelContainer>
        <Dialog.Panel className="dialog-panel">
          <DialogPanelStyles>
            <ExclamationTriangleIcon />
            <Dialog.Title as="h3">
              Give {props.user.firstName} admin access?
            </Dialog.Title>
            <Dialog.Description>
              This action will give {props.user.firstName} administrator access
              and functionality.
            </Dialog.Description>
            <div className="actions">
              <button
                type="button"
                onClick={() => props.setShow(false)}
                className="cancel-button"
              >
                No, cancel
              </button>
              <button
                type="submit"
                onClick={() => grantAdminAccessMutation.mutate()}
                className="action-button"
              >
                {grantAdminAccessMutation.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  'Yes, give admin access'
                )}
              </button>
            </div>
            {serverError ? (
              <div className="server-error">
                Server error. Please try again.
              </div>
            ) : null}
          </DialogPanelStyles>
        </Dialog.Panel>
      </DialogPanelContainer>
    </Dialog>
  );
}
