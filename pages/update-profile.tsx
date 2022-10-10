import React from 'react';
import { useRouter } from 'next/router';
import { FormikHelpers } from 'formik';
import styled from 'styled-components';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ProfileFormValues } from '../interfaces';
import { formatDbValuesForForm, formatFormValuesForDb } from '../utils/profile';
import { useUser } from '../hooks/useUser';
import useUpdateProfile from '../hooks/useUpdateProfile';
import FullLayout from '../components/layouts/FullLayout';
import ProfileForm from '../components/forms/ProfileForm';
import ServerError from '../components/ServerError';
import RemoveAdminAccessModal from '../components/modals/RemoveAdminAccessModal';
import SuccessNotification from '../components/common/SuccessNotification';
import DeleteAccountModal from '../components/modals/DeleteAccountModal';

export default function UpdateProfile() {
  const router = useRouter();
  const user = useUser();
  const { updateProfile, serverError } = useUpdateProfile();
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const [showRemoveAdminAccessModal, setShowRemoveAdminAccessModal] =
    React.useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] =
    React.useState(false);
  const [showRemoveAdminNotification, setShowRemoveAdminNotification] =
    React.useState(false);

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
            <div className="form-header">
              <div>
                <h2>Update your profile</h2>
                <p>Update any profile information that has changed.</p>
              </div>
              <Menu>
                <Menu.Button ref={menuButtonRef} className="menu-toggle-button">
                  Menu
                  <ChevronDownIcon strokeWidth={3} />
                </Menu.Button>
                <Menu.Items className="menu">
                  {user.data.isAdmin ? (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => setShowRemoveAdminAccessModal(true)}
                          className={`menu-item${active ? ' active' : ''}`}
                        >
                          Remove your admin access
                        </button>
                      )}
                    </Menu.Item>
                  ) : null}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => setShowDeleteAccountModal(true)}
                        className={`menu-item${active ? ' active' : ''}`}
                      >
                        Delete your account
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
            <ProfileForm
              initialValues={formatDbValuesForForm(user.data)}
              onSubmit={onSubmit}
              serverError={serverError}
            />
            <RemoveAdminAccessModal
              user={user.data}
              name="your"
              show={showRemoveAdminAccessModal}
              setShow={setShowRemoveAdminAccessModal}
              onCloseFocusItem={menuButtonRef}
              onMutationSuccess={() => {
                setShowRemoveAdminNotification(true);
              }}
            />
            <SuccessNotification
              show={showRemoveAdminNotification}
              setShow={setShowRemoveAdminNotification}
              title="Update successful"
              message={"You're no longer an administrator."}
            />
            <DeleteAccountModal
              user={user.data}
              name="your"
              show={showDeleteAccountModal}
              setShow={setShowDeleteAccountModal}
              onCloseFocusItem={menuButtonRef}
              onMutationSuccess={() => {
                router.push('/login');
              }}
            />
          </>
        )}
      </UpdateProfileStyles>
    </FullLayout>
  );
}

const UpdateProfileStyles = styled.div`
  position: relative;
  margin: 0 0 4rem;
  max-width: 38rem;
  width: 100%;

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

  .form-header {
    display: flex;
    justify-content: space-between;
  }

  .menu-toggle-button {
    padding: 0;
    height: 2rem;
    width: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    background-color: transparent;
    border: none;
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: color 100ms linear;

    &:hover {
      color: #000;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    svg {
      height: 0.9375rem;
      width: 0.9375rem;
      color: #9ca3af;
    }
  }

  .menu {
    position: absolute;
    top: 2.5rem;
    right: -0.625rem;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border: 1px solid #d4d6da;

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    .user-details {
      padding: 1rem 1.25rem;
      max-width: 14rem;
    }

    .user-label {
      display: flex;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: #1f2937;
      line-height: 1.5;

      svg {
        margin: 0.1875rem 0 0;
        flex-shrink: 0;
        height: 1rem;
        width: 1rem;
        color: #9ca3af;
      }
    }

    .menu-item {
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #fff;
      border: none;
      font-size: 0.875rem;
      color: #be123c;
      cursor: pointer;
      transition: all 100ms linear;

      &.active,
      &:hover {
        text-decoration: underline;
      }

      &:focus {
        z-index: 100;
      }

      &:first-child {
        border-top-right-radius: 0.5rem;
        border-top-left-radius: 0.5rem;
      }

      &:last-child {
        border-bottom-right-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
      }

      &:not(:first-child) {
        border-top: 1px solid #e5e7eb;
      }
    }
  }
`;
