import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, UseQueryResult } from 'react-query';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Menu } from '@headlessui/react';
import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Calendar, User } from '../interfaces';
import { formatPhoneNumber } from '../utils/misc';
import { fetchCalendarData } from '../utils/queries';
import { getMonthCalendarData } from '../utils/calendar';
import { useUser } from '../hooks/useUser';
import DirectoryCalendar from '../components/calendar/DirectoryCalendar';
import ServerError from '../components/ServerError';
import RemoveAdminAccessModal from './modals/RemoveAdminAccessModal';
import GrantAdminAccessModal from './modals/GrantAdminAccessModal';
import DeleteAccountModal from './modals/DeleteAccountModal';
import SuccessNotification from './common/SuccessNotification';

type Props = {
  userQuery: UseQueryResult<User | undefined, unknown>;
};

export default function DirectoryProfile(props: Props) {
  const router = useRouter();
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const [showGrantAdminStatusModal, setShowGrantAdminStatusModal] =
    React.useState(false);
  const [showRemoveAdminAccessModal, setShowRemoveAdminAccessModal] =
    React.useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] =
    React.useState(false);
  const [showGrantAdminNotification, setShowGrantAdminNotification] =
    React.useState(false);
  const [showRemoveAdminNotification, setShowRemoveAdminNotification] =
    React.useState(false);

  const [calendar, setCalendar] = React.useState(() => {
    const now = new Date();
    return {
      selectedDate: now,
      days: getMonthCalendarData(now),
    };
  });
  const loggedInUser = useUser();

  const calendarQuery = useQuery<Calendar>(
    ['calendar', 'year', calendar.selectedDate.getFullYear()],
    () => fetchCalendarData(calendar.selectedDate.getFullYear().toString()),
    { staleTime: 1000 * 60 * 5 }
  );

  return (
    <DirectoryProfileStyles>
      {props.userQuery.isLoading || calendarQuery.isLoading
        ? 'Loading...'
        : null}
      {props.userQuery.isError || calendarQuery.isError ? (
        <ServerError />
      ) : null}
      {props.userQuery.data && calendarQuery.data ? (
        <>
          <div className="box">
            <div className="profile-header">
              <div>
                <h2 className="name">
                  {props.userQuery.data.firstName}{' '}
                  {props.userQuery.data.lastName}
                </h2>
                <p className="city">
                  {props.userQuery.data.address.city},{' '}
                  {props.userQuery.data.address.state}
                </p>
              </div>
              {loggedInUser.data?.isAdmin &&
              loggedInUser.data.email !== props.userQuery.data.email ? (
                <Menu>
                  <Menu.Button
                    ref={menuButtonRef}
                    className="menu-toggle-button"
                  >
                    Menu
                    <ChevronDownIcon strokeWidth={3} />
                  </Menu.Button>
                  <Menu.Items className="menu">
                    <div className="user-details">
                      <div className="user-label">
                        <ExclamationCircleIcon strokeWidth={2} />
                        You have access to this menu as an admin user.
                      </div>
                    </div>
                    {props.userQuery.data.isAdmin ? (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={() => setShowRemoveAdminAccessModal(true)}
                            className={`menu-item${active ? ' active' : ''}`}
                          >
                            Remove {props.userQuery.data?.firstName}'s admin
                            access
                          </button>
                        )}
                      </Menu.Item>
                    ) : (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={() => setShowGrantAdminStatusModal(true)}
                            className={`menu-item${active ? ' active' : ''}`}
                          >
                            Give {props.userQuery.data?.firstName} admin access
                          </button>
                        )}
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => setShowDeleteAccountModal(true)}
                          className={`menu-item${active ? ' active' : ''}`}
                        >
                          Delete {props.userQuery.data?.firstName}'s account
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : null}
            </div>
            <div className="grid-cols-2">
              <div className="calendar-section">
                {router.isReady ? (
                  <DirectoryCalendar
                    userId={props.userQuery.data._id}
                    calendarQuery={calendarQuery}
                    calendar={calendar}
                    setCalendar={setCalendar}
                  />
                ) : null}
              </div>
              <div className="contact-info">
                <h3>Profile details</h3>
                {props.userQuery.data.email && (
                  <div className="contact-item">
                    <div className="label">Email</div>
                    <div className="value">
                      <a
                        href={`mailto:${props.userQuery.data.email}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {props.userQuery.data.email}
                      </a>
                    </div>
                  </div>
                )}
                {props.userQuery.data.phone && (
                  <div className="contact-item">
                    <div className="label">Phone</div>
                    <div className="value">
                      <a
                        href={`tel:+1${props.userQuery.data.phone}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {formatPhoneNumber(props.userQuery.data.phone)}
                      </a>
                    </div>
                  </div>
                )}
                <div className="contact-item">
                  <div className="label">Address</div>
                  <div className="value">
                    {props.userQuery.data.address.street
                      ? props.userQuery.data.address.street
                      : null}
                    {props.userQuery.data.address.street ||
                    props.userQuery.data.address.street2 ? (
                      <br />
                    ) : null}
                    {props.userQuery.data.address.street2
                      ? props.userQuery.data.address.street2
                      : null}
                    {props.userQuery.data.address.city},{' '}
                    {props.userQuery.data.address.state}{' '}
                    {props.userQuery.data.address.zipcode}
                  </div>
                </div>
                {props.userQuery.data.sports.length > 0 ? (
                  <div className="contact-item">
                    <div className="label">Sports</div>
                    {props.userQuery.data.sports.map(s => (
                      <div key={s.name} className="value sport">
                        {s.name} - <span className="level">{s.level}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {loggedInUser.data?.isAdmin ? (
                  <div className="contact-item">
                    <div className="label">Account status</div>
                    <div className="value">
                      {props.userQuery.data.isAdmin ? 'Admin' : 'Basic'}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <p className="last-updated">
            Last updated:{' '}
            {format(
              new Date(props.userQuery.data.updatedAt),
              "PP 'at' h:mmaaa"
            )}
          </p>
          <GrantAdminAccessModal
            user={props.userQuery.data}
            show={showGrantAdminStatusModal}
            setShow={setShowGrantAdminStatusModal}
            onCloseFocusItem={menuButtonRef}
            onMutationSuccess={() => {
              setShowGrantAdminNotification(true);
            }}
          />
          <SuccessNotification
            show={showGrantAdminNotification}
            setShow={setShowGrantAdminNotification}
            title="Update successful"
            message={`${props.userQuery.data.firstName} now has administrator status.`}
          />
          <RemoveAdminAccessModal
            user={props.userQuery.data}
            name={`${props.userQuery.data.firstName}'s`}
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
            message={`${props.userQuery.data.firstName} is no longer an administrator.`}
          />
          <DeleteAccountModal
            user={props.userQuery.data}
            name={`${props.userQuery.data.firstName}'s`}
            show={showDeleteAccountModal}
            setShow={setShowDeleteAccountModal}
            onCloseFocusItem={menuButtonRef}
            onMutationSuccess={() => {
              router.push(
                `/?deleteAccountNotification=true&name=${props.userQuery.data?.firstName}`,
                '/'
              );
            }}
          />
        </>
      ) : null}
    </DirectoryProfileStyles>
  );
}

const DirectoryProfileStyles = styled.div`
  margin: 0 0 3rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #06080b;
    line-height: 1.25;
  }

  .city {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;
  }

  .box {
    padding: 2.25rem 3rem 2.75rem;
    max-width: 60rem;
    width: 100%;
    background-color: #fafafa;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border: 1px solid #d4d6da;
  }

  .profile-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    top: 3.25rem;
    right: -1rem;
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
      color: #1f2937;
      cursor: pointer;
      transition: all 100ms linear;

      &.active,
      &:hover {
        background-color: #f3f4f6;
        color: #000;
      }

      &:focus {
        z-index: 100;
      }

      &:first-child {
        border-radius: 0.5rem 0.5rem 0 0;
      }

      &:last-child {
        border-radius: 0 0 0.5rem 0.5rem;
      }

      &:not(:first-child) {
        border-top: 1px solid #e5e7eb;
      }
    }
  }

  .grid-cols-2 {
    margin: 2rem 0 0;
    padding: 2rem 0 0;
    display: grid;
    grid-template-columns: 1fr 0.75fr;
    border-top: 1px solid #d1d5db;
  }

  .calendar-section {
    padding: 1rem 3.75rem 0 0;
    border-right: 1px solid #d1d5db;
  }

  .contact-info {
    margin: 0 0 0 -1px;
    padding: 1.5rem 0 0 3.75rem;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #d1d5db;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      line-height: 1;
    }

    .contact-item {
      margin: 2.25rem 0 0;
      display: flex;
      flex-direction: column;

      &:first-of-type {
        margin: 2rem 0 0;
      }

      .label {
        font-size: 0.9375rem;
        font-weight: 500;
        color: #6b7280;
      }

      .value {
        margin: 0.375rem 0 0;
        font-size: 0.9375rem;
        font-weight: 400;
        color: #111827;
        line-height: 1.5;

        a:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .last-updated {
    margin: 1.75rem 0 0 0.875rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #7e8694;
  }

  @media (max-width: 1260px) {
    .grid-cols-2 {
      grid-template-columns: 1fr;
    }

    .calendar-section {
      padding: 0;
      border-right: none;
    }

    .contact-info {
      margin: 3.5rem 0 0;
      padding: 3rem 0 0;
      border-left: none;
      border-top: 1px solid #d1d5db;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 0.5rem;

    h2 {
      margin: 2.25rem 0 0;
    }

    .name,
    .city {
      text-align: center;
    }
  }

  @media (max-width: 640px) {
    .grid-cols-2 {
      padding: 0;
      background-color: transparent;
      border: none;
      box-shadow: none;
    }

    .last-updated {
      margin: 2.25rem 0 0;
    }
  }
`;
