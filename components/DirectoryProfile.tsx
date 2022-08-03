import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery, UseQueryResult } from 'react-query';
import { format } from 'date-fns';
import styled from 'styled-components';
import { Calendar, User } from '../interfaces';
import { formatPhoneNumber } from '../utils/misc';
import { fetchCalendarData } from '../utils/queries';
import DirectoryCalendar from '../components/calendar/DirectoryCalendar';
import { getMonthCalendarData } from '../utils/calendar';
import ServerError from '../components/ServerError';

type Props = {
  userQuery: UseQueryResult<User | undefined, unknown>;
};

export default function DirectoryProfile(props: Props) {
  const router = useRouter();

  const [calendar, setCalendar] = React.useState(() => {
    const now = new Date();
    return {
      selectedDate: now,
      days: getMonthCalendarData(now),
    };
  });

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
        <div>
          <div>
            <div className="back-link-row">
              <Link href={`/directory/${router.query.s}`}>
                <a className="back-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back to directory
                </a>
              </Link>
            </div>
            <h2 className="name">
              {props.userQuery.data.firstName} {props.userQuery.data.lastName}
            </h2>
            <p className="city">
              {props.userQuery.data.city}, {props.userQuery.data.state}
            </p>
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
              <h3>Contact information</h3>
              {props.userQuery.data.email && (
                <div className="contact-item">
                  <div className="label">Email</div>
                  <div className="value">
                    <a href={`mailto:${props.userQuery.data.email}`}>
                      {props.userQuery.data.email}
                    </a>
                  </div>
                </div>
              )}
              {props.userQuery.data.cellPhone && (
                <div className="contact-item">
                  <div className="label">Cell</div>
                  <div className="value">
                    {formatPhoneNumber(props.userQuery.data.cellPhone)}
                  </div>
                </div>
              )}
              {props.userQuery.data.homePhone && (
                <div className="contact-item">
                  <div className="label">Home</div>
                  <div className="value">
                    {formatPhoneNumber(props.userQuery.data.homePhone)}
                  </div>
                </div>
              )}
              {props.userQuery.data.workPhone.number && (
                <div className="contact-item">
                  <div className="label">Work</div>
                  <div className="value">
                    {formatPhoneNumber(props.userQuery.data.workPhone.number)}{' '}
                    Ext. {props.userQuery.data.workPhone.extension}
                  </div>
                </div>
              )}
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
            </div>
          </div>
          <p className="last-updated">
            Last updated:{' '}
            {format(
              new Date(props.userQuery.data.updatedAt),
              "PP 'at' h:mmaaa"
            )}
          </p>
        </div>
      ) : null}
    </DirectoryProfileStyles>
  );
}

const DirectoryProfileStyles = styled.div`
  margin: 0 0 3rem;

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563;

    svg {
      height: 1.125rem;
      width: 1.125rem;
      color: #9ca3af;
    }

    &:hover {
      color: #111827;
    }
  }

  h2 {
    margin: 1.75rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #06080b;
    line-height: 1.25;
  }

  .city {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;
  }

  .grid-cols-2 {
    margin: 2rem 0 0;
    padding: 2.25rem 3rem 2.75rem;
    max-width: 60rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 0.75fr;
    background-color: #fdfdfd;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border-top: 1px solid #e9eaec;
  }

  .calendar-section {
    padding: 0 3.75rem 0 0;
    border-right: 1px solid #d1d5db;
  }

  .contact-info {
    margin: 0 0 0 -1px;
    padding: 2rem 0 0 3.75rem;
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

    .back-link-row {
      display: flex;
      justify-content: center;
    }

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
