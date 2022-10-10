import React from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Calendar } from '../interfaces';
import { formatPhoneNumber } from '../utils/misc';
import { getMonthCalendarData } from '../utils/calendar';
import { fetchCalendarData } from '../utils/queries';
import { useUser } from '../hooks/useUser';
import ProfileCalendar from './calendar/ProfileCalendar';
import ServerError from './ServerError';
import MenuItemLink from './common/MenuItemLink';

export default function UserProfile() {
  const user = useUser();
  const [calendar, setCalendar] = React.useState(() => {
    const now = new Date();
    return {
      selectedDate: now,
      days: getMonthCalendarData(now),
    };
  });

  const calendarQuery = useQuery<Calendar>(
    ['calendar', 'year', calendar.selectedDate.getFullYear().toString()],
    () => fetchCalendarData(calendar.selectedDate.getFullYear().toString()),
    { staleTime: 1000 * 60 * 5 }
  );

  return (
    <UserProfileStyles>
      {user.isLoading || calendarQuery.isLoading ? 'Loading...' : null}
      {user.isError || calendarQuery.isError ? <ServerError /> : null}
      {user.data && calendarQuery.data ? (
        <>
          <div className="header-row">
            <div>
              <h2>Your profile</h2>
              <p className="welcome">
                Welcome to our new website. If you have any questions or need to
                report a bug, please{' '}
                <Link href="/contact">
                  <a>contact us</a>
                </Link>
                .
              </p>
            </div>
            <Menu>
              <Menu.Button className="menu-toggle-button">
                Menu
                <ChevronDownIcon strokeWidth={3} />
              </Menu.Button>
              <Menu.Items className="menu">
                <div className="user-details">
                  <div className="user-label">Signed in as</div>
                  <div className="user-email">{user.data.email}</div>
                </div>
                <Menu.Item as={React.Fragment}>
                  {({ active }) => (
                    <MenuItemLink
                      href="/update-profile"
                      className={`menu-item${active ? ' active' : ''}`}
                    >
                      Update your profile
                    </MenuItemLink>
                  )}
                </Menu.Item>
                <Menu.Item as={React.Fragment}>
                  {({ active }) => (
                    <MenuItemLink
                      href="/contact"
                      className={`menu-item${active ? ' active' : ''}`}
                    >
                      Contact us
                    </MenuItemLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`menu-item${active ? ' active' : ''}`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
          <div className="grid-cols-2">
            <div className="calendar-section">
              <ProfileCalendar
                user={user.data}
                calendarQueryData={calendarQuery.data}
                calendar={calendar}
                setCalendar={setCalendar}
              />
            </div>
            <div className="contact-info">
              <h3>Contact information</h3>
              <div className="contact-item">
                <div className="label">Name</div>
                <div className="value">
                  {user.data.firstName} {user.data.lastName}
                </div>
              </div>
              <div className="contact-item">
                <div className="label">Address</div>
                <div className="value">
                  {user.data.address.street ? user.data.address.street : null}
                  {user.data.address.street2
                    ? ` ${user.data.address.street2}`
                    : null}
                  {user.data.address.street || user.data.address.street2 ? (
                    <br />
                  ) : null}
                  {user.data.address.city}, {user.data.address.state}{' '}
                  {user.data.address.zipcode}
                </div>
              </div>
              {user.data.email && (
                <div className="contact-item">
                  <div className="label">Email</div>
                  <div className="value">{user.data.email}</div>
                </div>
              )}
              {user.data.phone ? (
                <div className="contact-item">
                  <div className="label">Phone</div>
                  <div className="value">
                    {formatPhoneNumber(user.data.phone)}
                  </div>
                </div>
              ) : null}
              {user.data.sports.length > 0 ? (
                <div className="contact-item">
                  <div className="label">Sports</div>
                  {user.data.sports.map(s => (
                    <div key={s.name} className="value sport">
                      {s.name} - <span className="level">{s.level}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              {user.data.isAdmin ? (
                <div className="contact-item">
                  <div className="label">Account status</div>
                  <div className="value">Admin</div>
                </div>
              ) : null}
            </div>
          </div>
          <p className="last-updated">
            Last updated:{' '}
            {format(new Date(user.data.updatedAt), "PP 'at' h:mmaaa")}
          </p>
        </>
      ) : null}
    </UserProfileStyles>
  );
}

const UserProfileStyles = styled.div`
  margin: 0 0 3rem;

  .header-row {
    position: relative;
    display: flex;
    justify-content: space-between;
    max-width: 60rem;
    width: 100%;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #06080b;
    line-height: 1.25;
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #626875;

    a {
      text-decoration: underline;
    }

    &.welcome {
      margin: 0.625rem 0 0;
      max-width: 32rem;
    }

    &.last-updated {
      margin: 1.875rem 0 0 0.875rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
    }
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
    right: -0.5rem;
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
    }

    .user-label {
      font-size: 0.8125rem;
      color: #6b7280;
    }

    .user-email {
      margin: 0.3125rem 0 0;
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
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
    margin: 2.25rem 0 0;
    padding: 2.25rem 3rem 2.75rem;
    max-width: 60rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 0.7fr;
    background-color: #fafafa;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border: 1px solid #d4d6da;
  }

  .calendar-section {
    padding: 0.5rem 4rem 0.5rem 0;
    border-right: 1px solid #d1d5db;
  }

  .contact-info {
    margin: 1.25rem 0 1.25rem -1px;
    padding: 0 0 0 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
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

        .extension {
          padding: 0.1875rem 0 0 3.5rem;
          display: block;
        }
      }
    }
  }

  @media (max-width: 1260px) {
    .update-profile-link {
      display: none;
    }

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

  @media (max-width: 640px) {
    .grid-cols-2 {
      padding: 0;
      background-color: transparent;
      border: none;
      box-shadow: none;
    }

    p.last-updated {
      margin: 2.25rem 0 0;
    }
  }
`;
