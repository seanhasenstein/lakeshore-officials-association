import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import styled from 'styled-components';
import { Sport } from '../../interfaces';
import {
  formatPhoneNumber,
  formatToTitleCase,
  getUrlParam,
} from '../../utils/misc';
import { fetchUsersBySport } from '../../utils/queries';
import FullLayout from '../../components/layouts/FullLayout';
import LevelFilter from '../../components/directory/LevelFilter';
import DateSelection from '../../components/directory/DateSelection';
import Search from '../../components/directory/Search';
import DateQueryStatus from '../../components/directory/DateQueryStatus';

export default function SportPage() {
  const router = useRouter();
  const [sport, setSport] = React.useState<string>();
  const [selectedDate, setSelectedDate] = React.useState(
    format(new Date(), 'MM-dd-yyyy')
  );
  const [dateIds, setDateIds] = React.useState<string[]>();

  const sportQuery = useQuery(
    ['users', sport],
    () => fetchUsersBySport(sport as Sport | undefined),
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  const calendarQuery = useQuery(
    ['calendar', selectedDate],
    async () => {
      const response = await fetch(
        `/api/get-calendar-data?year=${new Date(selectedDate).getFullYear()}`
      );

      // TODO: handle !response.ok or error respsonse

      const data = await response.json();
      return data;
    },
    { staleTime: 1000 * 60 * 5 }
  );

  React.useEffect(() => {
    if (router.isReady && router.query.sport) {
      setSport(getUrlParam(router.query.sport));
    }
  }, [router.isReady, router.query.sport]);

  React.useEffect(() => {
    if (calendarQuery.data) {
      const date = new Date(selectedDate);
      const month = date.getMonth();
      const day = date.getDate();

      if (!calendarQuery.data[month]) {
        setDateIds(undefined);
        return;
      }

      const data = calendarQuery.data[month][day];
      setDateIds(data);
    }
  }, [calendarQuery.data, selectedDate]);

  return (
    <FullLayout
      title={sport ? formatToTitleCase(sport) : ''}
      authRequired={true}
    >
      <SportPageStyles>
        {sportQuery.isLoading ? 'Loading...' : ''}
        {sportQuery.data && sport ? (
          <>
            <h3 className="title">{formatToTitleCase(sport)} directory</h3>
            <div className="actions-row">
              <LevelFilter />
              <DateSelection
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
              <Search />
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name/Location</th>
                    <th className="level">Level</th>
                    <th className="date-query">Date query</th>
                    <th className="contact">Contact</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {sportQuery.data.map(v => {
                    const s = v.sports.find(
                      s => s.name === formatToTitleCase(sport)
                    );
                    return (
                      <tr key={v._id}>
                        <td>
                          <div className="name">
                            {v.firstName} {v.lastName}
                          </div>
                          <div className="city">{v.city}</div>
                        </td>
                        <td className="level">{s?.level}</td>
                        <td>
                          <DateQueryStatus id={v._id} dateIds={dateIds} />
                        </td>
                        <td className="contact">
                          <div className="contact-info">
                            {v.cellPhone && (
                              <div>
                                <span className="abbreviation">Cell:</span>
                                {formatPhoneNumber(v.cellPhone)}
                              </div>
                            )}
                            {v.homePhone && (
                              <div>
                                <span className="abbreviation">Home:</span>
                                {formatPhoneNumber(v.homePhone)}
                              </div>
                            )}
                            {v.workPhone.number && (
                              <div>
                                <span className="abbreviation">Work:</span>
                                {formatPhoneNumber(v.workPhone.number)}
                                {v.workPhone.extension && (
                                  <span className="extension">
                                    ext. {v.workPhone.extension}
                                  </span>
                                )}
                              </div>
                            )}
                            {v.email && (
                              <div>
                                <a
                                  href={`mailto:${v.email}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <span className="abbreviation">Email:</span>
                                  {v.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="calendar-link">
                          <Link
                            href={`/calendar/${
                              v._id
                            }?sport=${s?.name.toLowerCase()}`}
                          >
                            <a>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="sr-only">
                                Go to {v.firstName} {v.lastName}&apos;s calendar
                              </span>
                            </a>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </SportPageStyles>
    </FullLayout>
  );
}

const SportPageStyles = styled.div`
  margin: 0 0 5rem;

  .title {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #06080b;
  }

  .actions-row {
    margin: 2.5rem 0 0;
    display: flex;
    align-items: flex-end;
    max-width: 60rem;
  }

  .table-container {
    margin: 1.75rem 0 0;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.15);
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th {
    padding: 0.875rem 1.5rem;
    text-align: left;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #5c6a80;
    background-color: #e5e7eb;
    border-bottom: 1px solid #d1d5db;

    &:first-of-type {
      border-top-left-radius: 0.5rem;
    }

    &:last-of-type {
      border-top-right-radius: 0.5rem;
    }

    &.level {
      padding-left: 0;
      text-align: center;
    }

    &.date-query {
      text-align: center;
    }

    &.contact {
      padding-left: 2.5rem;
    }
  }

  td {
    padding: 0.875rem 1.5rem;
    background-color: #fff;
    border-bottom: 2px solid rgba(228, 233, 240, 0.75);
    font-size: 0.875rem;
    font-weight: 500;
    color: #141a25;

    .name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #06080b;
    }

    .city {
      margin: 0.1875rem 0 0;
      color: #9499a4;
    }

    &.level {
      padding-left: 0;
      text-align: center;
    }

    &.contact {
      padding-left: 2.5rem;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .number {
        display: flex;
        align-items: center;
      }

      .abbreviation {
        display: inline-block;
        width: 3.25rem;
        color: #9499a4;
      }

      .extension {
        margin: 0 0 0 0.625rem;
      }

      a:hover {
        text-decoration: underline;
      }
    }

    &.calendar-link {
      a {
        height: 1.75rem;
        width: 1.75rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #9499a4;

        &:hover {
          color: #141a25;
        }
      }

      svg {
        height: 1.125rem;
        width: 1.125rem;
      }
    }
  }

  tbody {
    tr {
      &:last-of-type {
        td {
          border-bottom: none;

          &:first-of-type {
            border-bottom-left-radius: 0.5rem;
          }

          &:last-of-type {
            border-bottom-right-radius: 0.5rem;
          }
        }
      }

      &:hover {
        td {
          background-color: #fbfbfb;
        }
      }
    }
  }
`;
