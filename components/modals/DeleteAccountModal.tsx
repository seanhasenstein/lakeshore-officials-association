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
  name: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseFocusItem: React.RefObject<HTMLElement>;
  onMutationSuccess?: () => void;
};

export default function DeleteAccountModal(props: Props) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = React.useState(false);

  const deleteAccountMutation = useMutation(
    async () => {
      const response = await fetch('/api/delete-user', {
        method: 'POST',
        body: JSON.stringify({ _id: props.user._id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Internal server error');
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['users']);
      },
      onError: () => {
        setServerError(true);
      },
      onSuccess: () => {
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
            <Dialog.Title as="h3">Delete {props.name} account?</Dialog.Title>
            <Dialog.Description>
              This action cannot be undone and will permanently delete{' '}
              {props.name} account.
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
                onClick={() => deleteAccountMutation.mutate()}
                className="action-button"
              >
                {deleteAccountMutation.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  'Yes, delete the account'
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
