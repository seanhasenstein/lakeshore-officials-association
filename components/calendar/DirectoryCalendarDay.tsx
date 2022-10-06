import React from 'react';
import styled from 'styled-components';
import { Calendar } from '../../interfaces';
import { isToday } from '../../utils/calendar';

type Props = {
  calendarData: Calendar | undefined;
  day: {
    date: string;
    dayOfMonth: number;
    isCurrentMonth: boolean;
  };
  userId: string;
};

export default function DirectoryCalendarDay(props: Props) {
  const [status, setStatus] = React.useState<'available' | 'unavailable'>();

  React.useEffect(() => {
    if (props.calendarData) {
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
      const updatedStatus = dayIdsArray.includes(props.userId)
        ? 'available'
        : 'unavailable';
      setStatus(updatedStatus);
    }
  }, [props.calendarData, props.day.date, props.userId]);

  return (
    <DirectoryCalendarDayStyles
      className={`${props.day.isCurrentMonth ? '' : ' not-current-month'}${` ${
        status ? status : ''
      }`}`}
    >
      <span className={`day${isToday(props.day.date) ? ' today' : ''}`}>
        {props.day.dayOfMonth}
      </span>
    </DirectoryCalendarDayStyles>
  );
}

const DirectoryCalendarDayStyles = styled.div`
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
  color: #111827;
  transition: background-color 100ms linear;

  &.available,
  &.available.not-current-month {
    background-color: #37da8e;
    color: #062014;
    z-index: 100;
  }

  &.unavailable {
    background-color: #fff;
    color: #111827;

    &.not-current-month {
      background-color: #f3f4f6;
      color: #1f2937;
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

  &.available .today {
    background-color: #09301e;
    color: #fefffe;
  }
`;
