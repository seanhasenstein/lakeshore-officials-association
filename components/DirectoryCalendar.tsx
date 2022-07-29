import React from 'react';
import styled from 'styled-components';
import { addMonths, format, subMonths } from 'date-fns';
import { getMonthCalendarData } from '../utils/calendar';

export default function DirectoryCalendar() {
  const [calendar, setCalendar] = React.useState(() => {
    const now = new Date();
    return {
      selectedDate: now,
      days: getMonthCalendarData(now),
    };
  });
  const [monthInput, setMonthInput] = React.useState(
    calendar.selectedDate.getMonth().toString()
  );
  const [yearInput, setYearInput] = React.useState<string>(
    calendar.selectedDate.getFullYear().toString()
  );
  const [searchError, setSearchError] = React.useState<string>();

  const handlePrevClick = () => {
    const prevMonth = subMonths(calendar.selectedDate, 1);
    setCalendar({
      selectedDate: prevMonth,
      days: getMonthCalendarData(prevMonth),
    });
    setYearInput(prevMonth.getFullYear().toString());
    setMonthInput(prevMonth.getMonth().toString());
  };

  const handleNextClick = () => {
    const nextMonth = addMonths(calendar.selectedDate, 1);
    setCalendar({
      selectedDate: nextMonth,
      days: getMonthCalendarData(nextMonth),
    });
    setYearInput(nextMonth.getFullYear().toString());
    setMonthInput(nextMonth.getMonth().toString());
  };

  const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 4) return;
    const update = e.target.value.replace(/\D/g, '');
    setYearInput(update);
  };

  const handleSearchClick = () => {
    try {
      if (yearInput.length !== 4) {
        throw new Error('Year must be 4 digits');
      }
      const monthIndexPlusOne = Number(monthInput) + 1;
      const month =
        monthIndexPlusOne < 10 ? `0${monthIndexPlusOne}` : monthIndexPlusOne;
      const requestedDate = new Date(`${yearInput}-${month}-01T00:00:00`);

      setCalendar({
        selectedDate: requestedDate,
        days: getMonthCalendarData(requestedDate),
      });
      setSearchError(undefined);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setSearchError(err.message);
      }
    }
  };

  return (
    <DirectoryCalendarStyles>
      <div className="menu-header">
        <div className="flex space-between">
          <p className="month">{format(calendar.selectedDate, 'MMMM yyyy')}</p>
          <div className="calendar-actions">
            <button
              type="button"
              onClick={handlePrevClick}
              className="toggle-month-button"
            >
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
              <span className="sr-only">Previous month</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setCalendar({
                  selectedDate: now,
                  days: getMonthCalendarData(now),
                });
                setYearInput(now.getFullYear().toString());
                setMonthInput(now.getMonth().toString());
                setSearchError(undefined);
              }}
              className="today-button"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNextClick}
              className="toggle-month-button"
            >
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
              <span className="sr-only">Next month</span>
            </button>
          </div>
        </div>
        <div className="calendar-form">
          <div className="form-item">
            <label htmlFor="month">Month</label>
            <select
              value={monthInput}
              onChange={e => setMonthInput(e.target.value)}
            >
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>
          <div className="form-item year-input">
            <label htmlFor="year">Year</label>
            <input
              type="text"
              name="year"
              id="year"
              value={yearInput}
              onChange={e => handleYearInputChange(e)}
            />
            {searchError ? (
              <div className="search-error">{searchError}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleSearchClick}
            className="go-to-month-button"
          >
            Search
          </button>
        </div>
      </div>
      <div className="calendar">
        <div className="calendar-header">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="calendar-body">
          <>
            {calendar.days.map((day, index) => (
              <div
                key={day.date + index}
                className={`day${
                  day.isCurrentMonth ? '' : ' not-current-month'
                }`}
              >
                {day.dayOfMonth}
              </div>
            ))}
          </>
        </div>
      </div>
    </DirectoryCalendarStyles>
  );
}

const DirectoryCalendarStyles = styled.div`
  .menu-header {
    .flex {
      display: flex;
      align-items: center;
    }

    .space-between {
      justify-content: space-between;
    }

    .calendar-actions {
      display: flex;
      align-items: center;
    }

    .month {
      font-size: 1.125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1f2937;
      line-height: 1;
    }
  }

  .today-button,
  .toggle-month-button {
    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      z-index: 100;
    }
  }

  .today-button {
    margin: 0 0 0 -1px;
    padding: 0 1rem;
    height: 2.25rem;
    background: #fff;
    border: 1px solid #d1d5db;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    cursor: pointer;

    &:hover {
      color: #000;
    }
  }

  .toggle-month-button {
    margin: 0;
    padding: 0;
    height: 2.25rem;
    width: 2.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border: 1px solid #d1d5db;
    color: #9ca3af;
    border-radius: 0.25rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;

    &:first-of-type {
      border-radius: 0.5rem 0 0 0.5rem;
    }

    &:last-of-type {
      margin: 0 0 0 -1px;
      border-radius: 0 0.5rem 0.5rem 0;
    }

    &:hover {
      color: #4b5563;
    }

    svg {
      flex-shrink: 0;
      height: 1.125rem;
      width: 1.125rem;
    }
  }

  .calendar-form {
    margin: 1.5rem 0 0;
    display: grid;
    grid-template-columns: 1fr 7rem 7rem;
    gap: 1rem;
    align-items: flex-end;

    input,
    select,
    .go-to-month-button {
      padding: 00 0.625rem;
      height: 2.5rem;
      border-radius: 0.375rem;
    }
  }

  .form-item {
    display: flex;
    flex-direction: column;
  }

  .go-to-month-button {
    padding: 0;
    color: #e6e7e9;
    background-color: #1c2a3f;
    border: 1px solid #1c2a3f;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;
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

  .year-input {
    position: relative;
  }

  .search-error {
    position: absolute;
    top: 4.5rem;
    left: 0;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #be123c;
  }

  .calendar {
    margin: 1.75rem 0 0;
    display: flex;
    flex-direction: column;
  }

  .calendar-header {
    padding: 0 0 0.375rem;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    font-size: 0.75rem;
    color: #4b5563;
    line-height: 1.5rem;
    width: 100%;
    text-align: center;
  }

  .calendar-body {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  .day {
    margin: -1px 0 0 -1px;
    padding: 0.625rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #fff;
    border: 1px solid #d1d5db;
    font-size: 0.875rem;
    color: #111827;
    transition: background-color 100ms linear;

    &.selected,
    &.not-current-month.selected {
      background-color: #162131;
      border-color: #162131;
      color: #f3f4f6;
      font-weight: 600;

      &:hover {
        background-color: #162131;
      }
    }

    &.not-current-month {
      background-color: #f3f4f6;

      &:hover {
        background-color: #e5e7eb;
      }
    }

    &:first-of-type {
      border-top-left-radius: 0.5rem;
    }

    &:nth-of-type(7) {
      border-top-right-radius: 0.5rem;
    }

    &:nth-of-type(36) {
      border-bottom-left-radius: 0.5rem;
    }

    &:last-of-type {
      border-bottom-right-radius: 0.5rem;
    }

    &:hover {
      background-color: #f3f4f6;
    }
  }
`;
