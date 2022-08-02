import React from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useUser } from '../hooks/useUser';
import { Calendar } from '../interfaces';
import { formatPhoneNumber } from '../utils/misc';
import { getMonthCalendarData } from '../utils/calendar';
import { fetchCalendarData } from '../utils/queries';
import ProfileCalendar from './calendar/ProfileCalendar';
import ServerError from './ServerError';

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
              <h2>Welcome back {user.data.firstName}</h2>
              <p className="welcome">
                If you have any questions about the new website or need to
                report a bug, please{' '}
                <Link href="/contact-admin">
                  <a>contact us</a>
                </Link>
                .
              </p>
            </div>
            <Link href="/update-profile">
              <a className="update-profile-link">Update contact info</a>
            </Link>
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
                <div className="label">Location</div>
                <div className="value">
                  {user.data.city}, {user.data.state}
                </div>
              </div>
              {user.data.email && (
                <div className="contact-item">
                  <div className="label">Email</div>
                  <div className="value">
                    <a href={`mailto:${user.data.email}`}>{user.data.email}</a>
                  </div>
                </div>
              )}
              {user.data.cellPhone ||
              user.data.homePhone ||
              user.data.workPhone.number ? (
                <div className="contact-item">
                  <div className="label">Phone</div>
                  <div className="value multiple">
                    {user.data.cellPhone ? (
                      <div>
                        <span className="secondary-label">Cell:</span>
                        {formatPhoneNumber(user.data.cellPhone)}
                      </div>
                    ) : null}
                    {user.data.homePhone ? (
                      <div>
                        <span className="secondary-label">Home:</span>
                        {formatPhoneNumber(user.data.homePhone)}
                      </div>
                    ) : null}
                    {user.data.workPhone.number ? (
                      <div>
                        <span className="secondary-label">Work:</span>
                        {formatPhoneNumber(user.data.workPhone.number)}{' '}
                        {user.data.workPhone.extension ? (
                          <span className="extension">
                            Ext. {user.data.workPhone.extension}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
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
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
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
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;

    a {
      text-decoration: underline;
    }

    &.welcome {
      margin: 0.625rem 0 0;
      max-width: 32rem;
    }

    &.last-updated {
      margin: 1.375rem 0 0 0.875rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #7e8694;
    }
  }

  .update-profile-link {
    flex-shrink: 0;
    margin: 0 0 0 2rem;
    padding: 0.6875rem 1.125rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #e6e7e9;
    background-color: #1c2a3f;
    border: none;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    transition: all 100ms linear;

    &:hover {
      color: #fbfbfc;
      background-color: #22334c;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
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
    border-top: 1px solid #e9eaec;
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

        &.multiple {
          display: flex;
          flex-direction: column;
          gap: 0.3125rem;
        }

        .secondary-label {
          display: inline-block;
          width: 3.5rem;
        }

        .extension {
          padding: 0.1875rem 0 0 3.5rem;
          display: block;
        }

        a:hover {
          text-decoration: underline;
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