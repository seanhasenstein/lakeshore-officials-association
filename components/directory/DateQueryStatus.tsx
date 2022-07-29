import React from 'react';
import styled from 'styled-components';

type Props = {
  id: string;
  dateIds: string[] | undefined;
};

export default function DateQueryStatus(props: Props) {
  const [status, setStatus] = React.useState<'available' | 'unavailable'>();

  React.useEffect(() => {
    if (props.dateIds) {
      setStatus(props.dateIds.includes(props.id) ? 'available' : 'unavailable');
    } else {
      setStatus('unavailable');
    }
  }, [props.dateIds, props.id]);

  if (!status) {
    return null;
  }

  return (
    <DateQueryStatusStyles className={status}>{status}</DateQueryStatusStyles>
  );
}

const DateQueryStatusStyles = styled.div`
  margin: 0 auto;
  padding: 0 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.666666667;
  text-transform: uppercase;
  letter-spacing: 0.075em;
  text-align: center;
  background-color: #d1d5db;

  &.available {
    background-color: #d1fae5;
    color: #047857;
  }

  &.unavailable {
    background-color: #ffe4e6;
    color: #be123c;
  }
`;
