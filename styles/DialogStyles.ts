import styled from 'styled-components';

export const DialogBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10000;
`;

export const DialogPanelContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 20000;
`;

export const DialogPanelStyles = styled.div`
  position: relative;
  padding: 2rem 3rem;
  max-width: 30rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 0.125rem;
  z-index: 30000;

  svg {
    flex-shrink: 0;
    height: 1.75rem;
    width: 1.75rem;
    color: #ff441a;
  }

  h3 {
    margin: 0.75rem 0 0;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    color: #06080b;
  }

  p {
    margin: 1rem 0 0;
    font-size: 1rem;
    text-align: center;
    color: #626875;
    line-height: 1.5;
  }

  .actions {
    margin: 1.75rem 0 0;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }

  .cancel-button,
  .action-button {
    padding: 0.75rem 1.5rem;
    height: 2.625rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 150ms linear;

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
    border-color: #d1d5db;
    color: #06080b;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background-color: #f9fafb;
      color: #000;
    }
  }

  .action-button {
    position: relative;
    min-width: 12rem;
    background-color: #162131;
    color: #fafbfd;

    &:hover {
      background-color: #1c2a3f;
      color: #fff;
    }
  }

  .server-error {
    margin: 1.25rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #f22c00;
  }
`;
