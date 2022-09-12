import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { Calendar, User } from '../../interfaces';
import { CurrentMonthDays, isToday } from '../../utils/calendar';

type Props = {
  calendarData: Calendar;
  day: CurrentMonthDays;
  setServerError: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
};

export default function DayButton(props: Props) {
  const queryClient = useQueryClient();
  const [status, setStatus] = React.useState<'available' | 'unavailable'>();

  React.useEffect(() => {
    const date = new Date(props.day.date);
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDate().toString();

    if (
      !props.calendarData[year] ||
      !props.calendarData[year][month] ||
      !props.calendarData[year][month][day]
    ) {
      setStatus('unavailable');
      return;
    }

    const dayIdsArray = props.calendarData[year][month][day];
    const updatedStatus = dayIdsArray.includes(props.user._id)
      ? 'available'
      : 'unavailable';
    setStatus(updatedStatus);
  }, [props.calendarData, props.day.date, props.user._id]);

  const dateToggle = useMutation(
    async ({
      dateString,
      status,
    }: {
      dateString: string;
      status: 'available' | 'unavailable' | undefined;
    }) => {
      const flipToggleStatus =
        status === 'unavailable' ? 'available' : 'unavailable';
      const response = await fetch('/api/update-calendar-day', {
        method: 'POST',
        body: JSON.stringify({
          user: props.user,
          dateString,
          status: flipToggleStatus,
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
          <span className={`day${isToday(props.day.date) ? ' today' : ''}`}>
            {props.day.dayOfMonth}
          </span>
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
    background-color: #2ee362;
    color: #021006;
    z-index: 100;

    &:hover {
      background-color: #1cce4f;
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

  .today {
    position: absolute;
    top: calc(50% - 0.875rem);
    left: calc(50% - 0.875rem);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.75rem;
    width: 1.75rem;
    background-color: #162131;
    border-radius: 9999px;
    color: #f3f4f6;
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
