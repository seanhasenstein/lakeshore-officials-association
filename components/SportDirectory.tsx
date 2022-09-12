import React from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Calendar, FilterLevels, Sport, User } from '../interfaces';
import LevelFilter from './directory/LevelFilter';
import DateSelection from './directory/DateSelection';
import ServerError from './ServerError';
import { fetchCalendarData, fetchUsersBySport } from '../utils/queries';
import { formatPhoneNumber, formatToTitleCase } from '../utils/misc';

const initialLevels = [
  { name: 'MS', checked: true },
  { name: 'L5', checked: true },
  { name: 'L4', checked: true },
  { name: 'L3', checked: true },
  { name: 'L2', checked: true },
  { name: 'L1', checked: true },
  { name: 'L0', checked: true },
];

interface FilteredUsers {
  available: User[];
  unavailable: User[];
}

type Props = {
  sport: string;
};

export default function SportDirectory(props: Props) {
  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    const storage = sessionStorage.getItem('sport');

    if (storage) {
      const parsedStorage = JSON.parse(storage);
      return parsedStorage.selectedDate;
    }

    return `${format(new Date(), 'yyyy-MM-dd')}T00:00:00`;
  });
  const [dateIds, setDateIds] = React.useState<string[]>();
  const [filteredLevels, setFilteredLevels] = React.useState<FilterLevels>(
    () => {
      const storage = sessionStorage.getItem('sport');

      if (storage) {
        const parsedStorage = JSON.parse(storage);
        return parsedStorage.filteredLevels;
      }

      return initialLevels;
    }
  );
  const [filteredUsers, setFilteredUsers] = React.useState<FilteredUsers>({
    available: [],
    unavailable: [],
  });

  const sportQuery = useQuery(
    ['users', 'sports', props.sport],
    () => fetchUsersBySport(props.sport as Sport | undefined),
    { staleTime: 1000 * 60 * 5 }
  );

  const calendarQuery = useQuery<Calendar>(
    ['calendar', 'year', new Date(selectedDate).getFullYear().toString()],
    async () => fetchCalendarData(selectedDate),
    { staleTime: 1000 * 60 * 5 }
  );

  // setSelectedDate with sessionStorage
  React.useEffect(() => {
    const storage = sessionStorage.getItem('sport');

    if (storage) {
      const parsedStorage = JSON.parse(storage);
      setSelectedDate(parsedStorage.selectedDate);
      setFilteredLevels(parsedStorage.filteredLevels);
    }
  }, []);

  // setDateIds
  React.useEffect(() => {
    if (calendarQuery.data) {
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      if (!calendarQuery.data[year] || !calendarQuery.data[year][month]) {
        setDateIds(undefined);
        return;
      }

      const data = calendarQuery.data[year][month][day];
      setDateIds(data);
    }
  }, [calendarQuery.data, selectedDate]);

  // setFilteredUsers
  React.useEffect(() => {
    if (sportQuery.data && props.sport) {
      const updatedFilteredUsers = sportQuery.data.reduce(
        (accumulator: FilteredUsers, currentUser) => {
          const userSport = currentUser.sports.find(
            s => s.name.toLowerCase() === props.sport
          );
          const userPassesFilteredLevels = filteredLevels.some(
            l => l.checked && l.name === userSport?.level
          );

          if (userPassesFilteredLevels) {
            const isAvailable = dateIds?.includes(currentUser._id);

            if (isAvailable) {
              accumulator.available.push(currentUser);
            } else {
              accumulator.unavailable.push(currentUser);
            }
          }

          return accumulator;
        },
        { available: [], unavailable: [] }
      );

      setFilteredUsers(updatedFilteredUsers);
    }
  }, [dateIds, filteredLevels, props.sport, sportQuery.data]);

  // sessionStorage
  React.useEffect(() => {
    const value = JSON.stringify({ filteredLevels, selectedDate });
    sessionStorage.setItem('sport', value);
  }, [filteredLevels, selectedDate]);

  return (
    <SportDirectoryStyles>
      {sportQuery.isLoading || calendarQuery.isLoading ? 'Loading...' : ''}
      {sportQuery.isError || calendarQuery.isError ? <ServerError /> : null}
      {sportQuery.data && calendarQuery.data && props.sport ? (
        <>
          <h3 className="title">{formatToTitleCase(props.sport)} directory</h3>
          <div className="actions-row">
            <LevelFilter
              levels={filteredLevels}
              setLevels={setFilteredLevels}
            />
            <DateSelection
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

          <div className="grid-container">
            <div className="grid-header">
              Availability on {format(new Date(selectedDate), 'MM-dd-yyyy')}
            </div>
            <div className="grid-body">
              {filteredUsers.available.map(user => {
                const sport = user.sports.find(
                  s => s.name === formatToTitleCase(props.sport)
                );

                return (
                  <Link
                    key={user._id}
                    href={`/calendar/${
                      user._id
                    }?s=${props.sport.toLowerCase()}`}
                  >
                    <a className="grid-body-row">
                      <div className="grid-body-item official">
                        <span className="available" />
                        <div>
                          <div className="name">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="location">{user.city}</div>
                        </div>
                      </div>
                      <div className="grid-body-item details">
                        <div className="level">
                          <span className="pill">{sport?.level}</span>
                        </div>
                        <div className="contact">
                          <div>
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                          </div>
                          {/* TODO: use phone number that they provide */}
                          <div>
                            <a href={`tel:+1${user.cellPhone}`}>
                              {formatPhoneNumber(user.cellPhone)}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="grid-body-item icon" aria-hidden="true">
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
                      </div>
                    </a>
                  </Link>
                );
              })}
              {filteredUsers.unavailable.map(user => {
                const sport = user.sports.find(
                  s => s.name === formatToTitleCase(props.sport)
                );

                return (
                  <Link
                    key={user._id}
                    href={`/calendar/${
                      user._id
                    }?s=${props.sport.toLowerCase()}`}
                  >
                    <a className="grid-body-row">
                      <div className="grid-body-item official">
                        <span className="unavailable" />
                        <div>
                          <div className="name">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="location">{user.city}</div>
                        </div>
                      </div>
                      <div className="grid-body-item details">
                        <div className="level">
                          <span className="pill">{sport?.level}</span>
                        </div>
                        <div className="contact">
                          <div>
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                          </div>
                          {/* TODO: use phone number that they provide */}
                          <div>
                            <a href={`tel:+1${user.cellPhone}`}>
                              {formatPhoneNumber(user.cellPhone)}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="grid-body-item icon" aria-hidden="true">
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
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </SportDirectoryStyles>
  );
}

const SportDirectoryStyles = styled.div`
  margin: 0 0 5rem;
  max-width: 46rem;

  .title {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #06080b;
  }

  .actions-row {
    margin: 2.5rem 0 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .grid-container {
    margin: 1.75rem 0 0;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.075),
      0 2px 4px -2px rgb(0 0 0 / 0.075);
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
  }

  .grid-body-row {
    display: grid;
    grid-template-columns: minmax(0, 16rem) 1fr 1.25rem;
    align-items: center;
  }

  .grid-header {
    padding: 0.875rem 2rem;
    background-color: #e5e7eb;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #374151;
    border-bottom: 1px solid #d1d5db;
    border-radius: 0.375rem 0.375rem 0 0;
  }

  .grid-body-row {
    padding: 0.75rem 2rem;
    background-color: #fff;
    border-bottom: 1px solid rgba(228, 233, 240, 1);
    transition: background-color 100ms linear;

    &:last-of-type {
      border-bottom: none;
      border-radius: 0 0 0.375rem 0.375rem;
    }

    &:hover {
      background-color: #fbfbfb;

      .icon svg {
        color: #374151;
      }
    }
  }

  .grid-body-item {
    font-size: 0.875rem;
    font-weight: 500;
    color: #141a25;
  }

  .official {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #06080b;
  }

  .location {
    margin: 0.125rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #7b8595;
  }

  .available,
  .unavailable {
    display: inline-block;
    height: 0.8125rem;
    width: 0.8125rem;
    border-radius: 9999px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  .available {
    background-color: #34d399;
    border: 3px solid #d1fae5;
  }

  .unavailable {
    background-color: #f87171;
    border: 3px solid #fee2e2;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .level {
    font-size: 0.8125rem;
    color: #374151;
  }

  .contact {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: #374151;

    > div {
      padding: 0 0.25rem 0 0;
      max-width: 12rem;
      width: 100%;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    a:hover {
      text-decoration: underline;
    }
  }

  .icon {
    display: flex;
    justify-content: flex-end;

    svg {
      height: 1.125rem;
      width: 1.125rem;
      color: #9ca3af;
    }
  }

  @media (max-width: 1024px) {
    max-width: 100%;

    .contact > div {
      max-width: 15rem;
    }
  }

  @media (max-width: 640px) {
    .actions-row {
      margin: 2rem 0 0;
      grid-template-columns: 1fr;
      align-items: flex-start;
      gap: 2.25rem;
    }

    .grid-header,
    .grid-body-row {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }

    .grid-body-row {
      grid-template-columns: minmax(0, 16rem) 1fr 2.75rem;
    }

    .contact {
      display: none;
    }
  }

  @media (max-width: 375px) {
    .grid-header,
    .grid-body-row {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }

    .official {
      gap: 0.6875rem;
    }

    .name {
      font-size: 0.875rem;
    }

    .location {
      font-size: 0.8125rem;
    }
  }
`;
