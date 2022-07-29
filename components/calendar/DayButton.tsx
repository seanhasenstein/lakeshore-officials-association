import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { useUser } from '../../hooks/useUser';
import { CalendarYear } from '../../interfaces';
import { CurrentMonthDays } from '../../utils/calendar';

type Props = {
  day: CurrentMonthDays;
  calendar: CalendarYear;
  setServerError: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DayButton(props: Props) {
  const queryClient = useQueryClient();
  const user = useUser();

  const dateObj = new Date(props.day.date);
  const year = dateObj.getFullYear().toString();
  const month = dateObj.getMonth().toString();
  const date = dateObj.getDate().toString();
  const calendar = props.calendar;
  const dateCheck =
    calendar[year] !== undefined &&
    calendar[year][month] !== undefined &&
    calendar[year][month][date] !== undefined
      ? calendar[year][month][date]
      : undefined;

  const status = dateCheck
    ? dateCheck.includes(user.data?._id || '')
      ? 'available'
      : 'unavailable'
    : 'unavailable';

  const dateToggle = useMutation(
    async ({
      dateString,
      status,
    }: {
      dateString: string;
      status: 'available' | 'unavailable';
    }) => {
      const toggledStatus =
        status === 'unavailable' ? 'available' : 'unavailable';
      const response = await fetch('/api/update-calendar-day', {
        method: 'POST',
        body: JSON.stringify({
          user: user.data,
          dateString,
          status: toggledStatus,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        props.setServerError(true);
        throw new Error('Something went wrong on the server.');
      }

      props.setServerError(false);
      const data = await response.json();
      return data;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['calendar']);
        queryClient.invalidateQueries(['users']);
      },
    }
  );

  return (
    <DayButtonStyles
      type="button"
      onClick={() => dateToggle.mutate({ dateString: props.day.date, status })}
      disabled={dateToggle.isLoading}
      className={`day-button${
        props.day.isCurrentMonth ? '' : ' not-current-month'
      } ${status}`}
    >
      {dateToggle.isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {props.day.dayOfMonth}
          <span className="sr-only">
            {status === 'available'
              ? 'Available on this day'
              : 'Unavailable on this day'}
          </span>
        </>
      )}
    </DayButtonStyles>
  );
}

const DayButtonStyles = styled.button`
  position: relative;
  margin: -1px 0 0 -1px;
  padding: 0.75rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
  font-weight: 400;
  color: #111827;
  cursor: pointer;
  transition: background-color 100ms linear;

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  &:focus-visible {
    z-index: 200;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
      rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  &.available,
  &.available.not-current-month {
    background-color: #a7f3d0;
    color: #053c2d;
    z-index: 100;

    &:hover {
      background-color: #8aeabe;
    }
  }

  &.unavailable {
    background-color: #fff;
    color: #111827;

    &.not-current-month {
      background-color: #f3f4f6;
      color: #1f2937;
    }

    &:hover,
    &.not-current-month:hover {
      background-color: #e5e7eb;
      color: #111827;
      z-index: 100;
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
`;

const LoadingSpinner = styled.span`
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border-top: 2px solid rgba(0, 0, 0, 0.25);
    border-right: 2px solid transparent;
    animation: spinner 0.6s linear infinite;
  }
`;
