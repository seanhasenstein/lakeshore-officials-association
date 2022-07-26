import React from 'react';
import styled from 'styled-components';
import { addMonths, format, subMonths } from 'date-fns';
import { CurrentMonthDays, getMonthCalendarData } from '../utils/calendar';

type Props = {
  calendar: {
    selectedDate: Date;
    days: CurrentMonthDays[];
  };
  setCalendar: React.Dispatch<
    React.SetStateAction<{
      selectedDate: Date;
      days: CurrentMonthDays[];
    }>
  >;
  menuRef: React.RefObject<HTMLDivElement>;
  setInputDate: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  menu: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleMenuButtonClick: () => void;
  };
};

export default function CalendarDropdown(props: Props) {
  React.useEffect(() => {
    return () => {
      props.setCalendar({
        selectedDate: new Date(props.selectedDate),
        days: getMonthCalendarData(new Date(props.selectedDate)),
      });
    };
  }, []);

  const handlePrevClick = () => {
    const prevMonth = subMonths(props.calendar.selectedDate, 1);
    props.setCalendar({
      selectedDate: prevMonth,
      days: getMonthCalendarData(prevMonth),
    });
  };

  const handleNextClick = () => {
    const nextMonth = addMonths(props.calendar.selectedDate, 1);
    props.setCalendar({
      selectedDate: nextMonth,
      days: getMonthCalendarData(nextMonth),
    });
  };

  return (
    <CalendarDropdownStyles ref={props.menuRef} isOpen={props.menu.isOpen}>
      <div className="menu-header">
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
        <p className="month">
          {format(props.calendar.selectedDate, 'MMMM yyyy')}
        </p>
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
            {props.calendar.days.map((day, index) => (
              <button
                key={day.date + index}
                type="button"
                onClick={() => {
                  const date = new Date(`${day.date}`);
                  const year = date.getFullYear();
                  const month = date.getMonth();
                  const dayDate = date.getDate();
                  const update = format(
                    new Date(year, month, dayDate),
                    'MM-dd-yyyy'
                  );
                  props.setSelectedDate(update);
                  props.setInputDate(update);
                  props.menu.setIsOpen(false);
                }}
                className={`day-button
                  ${day.date === props.selectedDate ? ' selected' : ''}
                  ${day.isCurrentMonth ? '' : ' not-current-month'}
                  `}
              >
                {day.dayOfMonth}
              </button>
            ))}
          </>
        </div>
      </div>
      <div className="calendar-actions">
        <button
          type="button"
          onClick={() => props.menu.setIsOpen(false)}
          className="cancel-button"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            const date = new Date();
            const today = format(date, 'MM-dd-yyyy');
            props.setSelectedDate(today);
            props.setInputDate(today);
            props.setCalendar({
              selectedDate: date,
              days: getMonthCalendarData(date),
            });
          }}
          className="back-to-today-button"
        >
          Back to today
        </button>
      </div>
    </CalendarDropdownStyles>
  );
}

const CalendarDropdownStyles = styled.div<{ isOpen: boolean }>`
  /* display: ${props => (props.isOpen ? 'inline-block' : 'none')}; */
  display: 'inline-block';
  padding: 1rem 1.5rem 1.25rem;
  position: absolute;
  top: 4.75rem;
  left: 2rem;
  white-space: nowrap;
  width: 23rem;
  background-color: #fafafa;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;

  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .month {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1f2937;
      line-height: 1;
    }
  }

  .toggle-month-button {
    margin: 0.25rem 0 0;
    height: 2rem;
    width: 2rem;
    display: flex;
    justify-content: cener;
    align-items: center;
    background-color: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 9999px;

    &:hover {
      color: #111827;
    }

    svg {
      flex-shrink: 0;
      height: 1.25rem;
      width: 1.25rem;
    }
  }

  .calendar {
    margin: 1.5rem 0 0;
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

  .day-button {
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
    cursor: pointer;
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

    &:focus {
      z-index: 100;
    }
  }

  .calendar-actions {
    margin: 0.9375rem 0 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 0.75rem;
  }

  .cancel-button,
  .back-to-today-button {
    padding: 0.3125rem 0.875rem;
    font-size: 0.8125rem;
    font-weight: 500;
    border-radius: 0.25rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;
    transition: all 100ms linear;

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .cancel-button {
    background-color: #fff;
    border: 1px solid #d1d5db;

    &:hover {
      border-color: #b0b7c1;
    }
  }

  .back-to-today-button {
    padding: 0.3125rem 1rem;
    color: #e6e7e9;
    background-color: #1c2a3f;
    border: 1px solid #1c2a3f;

    &:hover {
      color: #fbfbfc;
      background-color: #22334c;
    }
  }
`;
