import React from 'react';
import styled from 'styled-components';
import useMenu from '../../hooks/useMenu';
import { format } from 'date-fns';
import { getMonthCalendarData } from '../../utils/calendar';
import CalendarDropdown from '../calendar/CalendarDropdown';
import { formatToTwoDigits } from '../../utils/misc';

type Props = {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
};

export default function DateSelection(props: Props) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menu = useMenu(menuRef);

  const [inputDate, setInputDate] = React.useState(() => {
    return format(new Date(props.selectedDate), 'MM-dd-yyyy');
  });
  const [dateInputError, setDateInputError] = React.useState(false);
  const [calendar, setCalendar] = React.useState(() => {
    const now = new Date(props.selectedDate);
    return {
      selectedDate: now,
      days: getMonthCalendarData(now),
    };
  });

  const handleSearchSubmit = () => {
    try {
      const splitInputDate = inputDate.split('-');
      const year = splitInputDate[2];
      const month = formatToTwoDigits(splitInputDate[0]);
      const day = formatToTwoDigits(splitInputDate[1]);
      const date = new Date(`${year}-${month}-${day}T00:00:00`);
      const stringDate = `${format(new Date(date), 'yyyy-MM-dd')}T00:00:00`;
      props.setSelectedDate(stringDate);
      setInputDate(format(date, 'MM-dd-yyyy'));
      setDateInputError(false);
      setCalendar({
        selectedDate: date,
        days: getMonthCalendarData(date),
      });
    } catch (error) {
      console.error(error);
      setDateInputError(true);
    }
  };

  return (
    <DateStyles isOpen={menu.isOpen}>
      <label htmlFor="date">Date query:</label>
      <div className="input-group">
        <button
          className="search-input-button"
          onClick={menu.handleMenuButtonClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        <input
          type="text"
          name="date"
          id="date"
          placeholder="mm/dd/yyyy"
          className="date-input"
          value={inputDate}
          onChange={e => setInputDate(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSearchSubmit}
          disabled={inputDate === format(calendar.selectedDate, 'MM-dd-yyyy')}
          className="date-calendar-button"
        >
          Search
        </button>
        {dateInputError ? (
          <div className="date-input-error">Invalid date (mm-dd-yyyy)</div>
        ) : null}
      </div>
      {menu.isOpen ? (
        <CalendarDropdown
          calendar={calendar}
          setCalendar={setCalendar}
          menuRef={menuRef}
          setInputDate={setInputDate}
          selectedDate={props.selectedDate}
          setSelectedDate={props.setSelectedDate}
          menu={menu}
        />
      ) : null}
    </DateStyles>
  );
}

const DateStyles = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;

  label {
    margin: 0 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    color: #1f2937;
  }

  .input-group {
    position: relative;
    display: flex;
    align-items: center;
  }

  .date-calendar-button {
    position: absolute;
    right: 0.25rem;
    padding: 0 1.25rem;
    height: 1.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #e6e7e9;
    background-color: #1c2a3f;
    border: none;
    border-radius: 0.25rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;
    transition: all 100ms linear;

    &:disabled,
    &:disabled:hover {
      background-color: #1c2a3f;
      color: #e6e7e9;
      cursor: default;
    }

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

  .search-input-button {
    padding: 0.1875rem 0.125rem 0.125rem 0.125rem;
    position: absolute;
    top: 0.5rem;
    left: 0.625rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;

    svg {
      height: 0.875rem;
      width: 0.875rem;
      color: #374151;
    }
  }

  .date-input-error {
    position: absolute;
    top: 2.5rem;
    left: 0;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #be123c;
  }

  .date-input {
    padding-left: 2.1875rem;
    height: 2.25rem;
    min-width: 14rem;
    border-radius: 0.375rem;
  }

  @media (max-width: 640px) {
    width: 100%;

    .date-input {
      padding-top: 0.625rem;
      padding-bottom: 0.625rem;
      height: initial;
      width: 100%;
    }

    .search-input-button {
      top: 0.625rem;
    }

    .date-calendar-button {
      right: 0.375rem;
    }
  }
`;
