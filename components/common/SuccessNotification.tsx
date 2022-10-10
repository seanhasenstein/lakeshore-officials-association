import React from 'react';
import styled from 'styled-components';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  message: string;
};

export default function SuccessNotification(props: Props) {
  return (
    <StyledSuccessNotification
      aria-hidden={!props.show}
      className={props.show ? 'show' : 'hidden'}
    >
      <div className="flex-row">
        <div className="icon">
          <CheckCircleIcon />
        </div>
        <div>
          <div className="title">{props.title}</div>
          <div className="message">{props.message}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => props.setShow(false)}
        className="close-button"
      >
        <XMarkIcon />
        <span className="sr-only">Close notification</span>
      </button>
    </StyledSuccessNotification>
  );
}

const StyledSuccessNotification = styled.div`
  transition: transform 300ms ease-in-out;
  position: fixed;
  top: 2rem;
  right: 0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  &.hidden {
    transform: translateX(100%);
    transition: transform 300ms ease-in-out;
  }

  &.show {
    right: 1.5rem;
    transform: translateX(0);
    transition: transform 300ms ease-in-out;
  }

  .flex-row {
    margin: 0 2rem 0 0;
    display: flex;
    gap: 0.875rem;
  }

  .icon {
    flex-shrink: 0;

    svg {
      height: 1.5rem;
      width: 1.5rem;
      color: #4ade80;
    }
  }

  .title {
    padding-top: 0.125rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }

  .message {
    margin: 0.375rem 0 0;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .close-button {
    flex-shrink: 0;
    padding: 0;
    height: 1.25rem;
    width: 1.25rem;
    display: inline-flex;
    background-color: transparent;
    border: none;
    border-radius: 0.375rem;
    color: #9ca3af;
    cursor: pointer;

    &:hover {
      color: #6b7280;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: #fff 0px 0px 0px 2px, #6366f1 0px 0px 0px 4px,
        #000 0px 0px 0px #000;
    }

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }
  }
`;
