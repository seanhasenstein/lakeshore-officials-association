import Link from 'next/link';
import styled from 'styled-components';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import SimpleLayout from '../components/layouts/SimpleLayout';

export default function Unauthorized() {
  return (
    <SimpleLayout title="Unauthorized">
      <UnauthorizedStyles>
        <div className="container">
          <div className="icon">
            <ExclamationTriangleIcon />
          </div>
          <h2>Unauthorized</h2>
          <p>Access denied. You need to be logged in to continue.</p>
          <Link href="/login">
            <a className="login-link">Go to log in</a>
          </Link>
        </div>
      </UnauthorizedStyles>
    </SimpleLayout>
  );
}

const UnauthorizedStyles = styled.div`
  padding: 0 1.5rem;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f3f7;

  .container {
    position: relative;
    padding: 3rem 5rem;
    max-width: 30rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      height: 2rem;
      width: 2rem;
      color: #ff441a;
    }
  }

  h2,
  p {
    text-align: center;
  }

  h2 {
    margin: 0.5rem 0 0;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #141a25;
  }

  p {
    margin: 1rem 0 0;
    font-size: 1rem;
    color: #747b89;
    line-height: 1.5;
  }

  .login-link {
    margin: 1.5rem 0 0;
    height: 2.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #222c3e;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #e4e9f0;
    cursor: pointer;
    transition: backgroun-color 150ms linear;

    &:hover {
      background-color: #1b2331;
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

  @media (max-width: 640px) {
    .container {
      padding: 1.75rem 1.5rem;
    }
  }
`;
