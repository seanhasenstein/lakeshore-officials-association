import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import {
  DialogBackdrop,
  DialogPanelContainer,
  DialogPanelStyles,
} from '../../styles/DialogStyles';
import { User } from '../../interfaces';
import { LoadingSpinner } from '../../styles/LoadingSpinner';

type Props = {
  user: User;
  name: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseFocusItem: React.RefObject<HTMLElement>;
  onMutationSuccess?: () => void;
};

export default function RemoveAdminAccessModal(props: Props) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = React.useState(false);

  const removeAdminAccessMutation = useMutation(
    async () => {
      const { _id, ...updatedUser }: User = { ...props.user, isAdmin: false };
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
              Remove {props.name} admin access?
            </Dialog.Title>
            <Dialog.Description>
              This action will remove {props.name} admin access, setting the
              account privileges to basic.
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
                onClick={() => removeAdminAccessMutation.mutate()}
                className="action-button"
              >
                {removeAdminAccessMutation.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  'Yes, remove admin access'
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
