import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Calendar, FilterLevels, Sport, User } from '../interfaces';
import LevelFilter from './directory/LevelFilter';
import DateSelection from './directory/DateSelection';
import TableRow from './directory/TableRow';
import ServerError from './ServerError';
import { fetchCalendarData, fetchUsersBySport } from '../utils/queries';
import { formatToTitleCase } from '../utils/misc';

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
  const [activeContactInfo, setActiveContactInfo] = React.useState<string>();

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

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name/Location</th>
                  <th className="level">Level</th>
                  <th className="contact">Contact info</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="secondary">
                    <div>Available</div>
                  </th>
                  <th className="secondary" aria-hidden="true">
                    <div />
                  </th>
                  <th className="secondary" aria-hidden="true">
                    <div />
                  </th>
                  <th className="secondary" aria-hidden="true">
                    <div />
                  </th>
                </tr>
                {filteredUsers.available.length < 1 ? (
                  <tr>
                    <td>No officials match your filter</td>
                    <td />
                    <td />
                    <td />
                  </tr>
                ) : (
                  <>
                    {filteredUsers.available.map(user => (
                      <TableRow
                        key={user._id}
                        user={user}
                        sport={props.sport}
                        status="available"
                        activeContactInfo={activeContactInfo}
                        setActiveContactInfo={setActiveContactInfo}
                      />
                    ))}
                  </>
                )}
                <tr>
                  <th className="secondary">
                    <div>Unavailable</div>
                  </th>
                  <th className="secondary" aria-hidden="true">
                    <div />
                  </th>
                  <th className="secondary" aria-hidden="true">
                    <div />
                  </th>
                  <th className="secondary" aria-hidden="true">
                    <div />
                  </th>
                </tr>
                {filteredUsers.unavailable.length < 1 ? (
                  <tr>
                    <td>No officials match your filter</td>
                    <td />
                    <td />
                    <td />
                  </tr>
                ) : (
                  <>
                    {filteredUsers.unavailable.map(user => (
                      <TableRow
                        key={user._id}
                        user={user}
                        sport={props.sport}
                        status="unavailable"
                        activeContactInfo={activeContactInfo}
                        setActiveContactInfo={setActiveContactInfo}
                      />
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </SportDirectoryStyles>
  );
}

const SportDirectoryStyles = styled.div`
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
    gap: 3rem;
    max-width: 60rem;
  }

  .table-container {
    margin: 1.75rem 0 0;
    white-space: nowrap;
    overflow: auto hidden;
    position: relative;
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
    padding: 0.875rem 2rem;
    text-align: left;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #374151;
    background-color: #e5e7eb;
    border-bottom: 1px solid #d1d5db;

    &.secondary,
    &.secondary:first-of-type,
    &.secondary:last-of-type {
      padding: 0;
      background-color: #f3f4f6;
      border-radius: 0;
      text-transform: none;
      border-bottom: 1px solid #d1d5db;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      letter-spacing: 0.00625em;

      > div {
        position: relative;
        margin: -1px 0 0;
        padding: 0.875rem 2rem;
        height: 46px;
        border-top: 1px solid #d1d5db;
        z-index: 100;
      }
    }

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
  }

  td {
    padding: 0.875rem 2rem;
    background-color: #fff;
    border-bottom: 1px solid rgba(228, 233, 240, 1);
    font-size: 0.875rem;
    font-weight: 500;
    color: #141a25;

    .official {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #06080b;
    }

    .location {
      margin: 0.1875rem 0 0;
      color: #9499a4;
    }

    &.level {
      padding-left: 0;
      font-size: 0.8125rem;
      text-align: center;
    }

    &.contact {
      .expand-contact-button {
        padding: 0.0625rem 0.375rem;
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #9499a4;
        border: 1px solid #d1d5db;
        border-radius: 0.3125rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1),
          0 1px 2px -1px rgb(0 0 0 / 0.1);
        cursor: pointer;
        transition: all 100ms linear;

        svg {
          height: 1.25rem;
          width: 1.25rem;
        }

        &:hover {
          background-color: #f9fafb;
          border-color: #bbc1ca;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.2),
            0 1px 2px -1px rgb(0 0 0 / 0.2);
        }
      }
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;

      .number {
        display: flex;
        align-items: center;
      }

      .abbreviation {
        margin: 0 0.5rem 0 0;
        padding: 0.125rem 0;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: 1.125rem;
        width: 3rem;
        background-color: #f3f4f6;
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.075em;
        color: #4b5563;
        border: 1px solid #e5e7eb;
        border-radius: 9999px;
      }

      .extension {
        margin: 0 0 0 0.5rem;
      }

      a {
        &:hover {
          text-decoration: underline;
        }

        &:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }

        &:focus-visible {
          text-decoration: underline;
          color: #0a65ed;
        }
      }
    }

    &.view-profile {
      text-align: right;

      a {
        font-size: 0.875rem;
        font-weight: 500;
        color: #084db5;
        border-radius: 9999px;

        &:hover {
          text-decoration: underline;
        }

        &:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }

        &:focus-visible {
          text-decoration: underline;
          color: #0a65ed;
        }
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

  .green,
  .red {
    display: inline-block;
    height: 0.8125rem;
    width: 0.8125rem;
    border-radius: 9999px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  .green {
    background-color: #34d399;
    border: 3px solid #d1fae5;
  }

  .red {
    background-color: #f87171;
    border: 3px solid #fee2e2;
  }

  @media (max-width: 640px) {
    .actions-row {
      margin: 2rem 0 0;
      flex-direction: column;
      align-items: flex-start;
      gap: 2.25rem;
    }
  }
`;
