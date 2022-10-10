import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import SimpleLayout from '../components/layouts/SimpleLayout';

type Props = {
  children: React.ReactNode;
};

function AuthErrorLayout({ children }: Props) {
  return (
    <SimpleLayout title="Authentication error">
      <AuthErrorStyles>
        <div className="container">
          <div className="icon">
            <ExclamationTriangleIcon />
          </div>
          {children}
        </div>
      </AuthErrorStyles>
    </SimpleLayout>
  );
}

export default function AuthenticationError() {
  const router = useRouter();
  const error =
    typeof router.query.error === 'string' && router.query.error.toLowerCase();

  if (error === 'configuration') {
    return (
      <AuthErrorLayout>
        <h2>Server Error</h2>
        <p>
          There is a problem with the server configuration. If this problem
          persists {/* TODO: link to marketing site contact form */}
          <Link href="/contact-us">
            <a>contact usistrator</a>
          </Link>
          .
        </p>
        <Link href="/login">
          <a className="login-link">Try logging in again</a>
        </Link>
      </AuthErrorLayout>
    );
  }

  if (error === 'accessdenied') {
    return (
      <AuthErrorLayout>
        <h2>Access Denied</h2>
        <p>
          You do not have permission to log in. If you think this is an error{' '}
          {/* TODO: link to marketing site contact form */}
          <Link href="/contact-us">
            <a>contact usistrator</a>
          </Link>
          .
        </p>
      </AuthErrorLayout>
    );
  }

  if (error == 'verification') {
    return (
      <AuthErrorLayout>
        <h2>Unable to log in</h2>
        <p>
          The log in link is no longer valid. It may have already been used or
          it may have expired.
        </p>
        <Link href="/login">
          <a className="login-link">Go to request another link</a>
        </Link>
      </AuthErrorLayout>
    );
  } else {
    return (
      <AuthErrorLayout>
        <h2>Authentication Error</h2>
        <p>
          An error occurred during authentication. If this error continues,{' '}
          {/* TODO: link to marketing site contact form */}
          <Link href="/contact-us">
            <a>contact usistrator</a>
          </Link>
          .
        </p>
        <Link href="/login">
          <a className="login-link">Try logging in again</a>
        </Link>
      </AuthErrorLayout>
    );
  }
}

const AuthErrorStyles = styled.div`
  padding: 0 1.5rem;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f3f7;

  .container {
    position: relative;
    padding: 3rem 4rem;
    max-width: 30rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 0.125rem;
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
  h3,
  p {
    text-align: center;
  }

  h2 {
    margin: 0.625rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #141a25;
  }

  h3 {
    margin: 1.5rem 0 0;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #7f8592;
  }

  p {
    margin: 1rem 0 0;
    font-size: 1rem;
    color: #222c3e;
    line-height: 1.5;

    a {
      color: #1860cc;
      text-decoration: underline;
    }
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
