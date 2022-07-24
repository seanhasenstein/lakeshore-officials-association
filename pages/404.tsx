import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import FullLayout from '../components/layouts/FullLayout';
import BasicTopHeaderLayout from '../components/layouts/BasicTopHeaderLayout';

function Box() {
  return (
    <BoxStyles>
      <div className="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2>404 - Page not found</h2>
      <p>Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/">Back to homepage</Link>
    </BoxStyles>
  );
}

export default function FourOhFour() {
  const session = useSession();

  return (
    <>
      {session.status === 'loading' ? null : session.status ===
        'authenticated' ? (
        <FullLayout title="404 - Page not found" authRequired={true}>
          <AuthenticatedStyles>
            <Box />
          </AuthenticatedStyles>
        </FullLayout>
      ) : (
        <BasicTopHeaderLayout title="404 - Page not found">
          <UnauthenticatedStyles>
            <Box />
          </UnauthenticatedStyles>
        </BasicTopHeaderLayout>
      )}
    </>
  );
}

const BoxStyles = styled.div`
  padding: 1.75rem 2.25rem;
  max-width: 30rem;
  width: 100%;
  background-color: #fefefe;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border-top: 1px solid #e9eaec;

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      height: 2rem;
      width: 2rem;
      color: #be123c;
    }
  }

  h2 {
    margin: 0.75rem 0 0;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #06080b;
    text-align: center;
  }

  p {
    margin: 0.875rem 0 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;
    text-align: center;
  }

  a {
    margin: 1.25rem 0 0;
    position: relative;
    padding: 0 1.125rem;
    height: 2.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #e6e7e9;
    background-color: #1c2a3f;
    border: none;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;
    transition: all 100ms linear;

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
`;

const AuthenticatedStyles = styled.div`
  min-height: calc(100vh - 80px - 79px);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    margin: 0 0 2.5rem;
    min-height: calc(100vh - 105px - 91px - 40px - 40px);
  }
`;

const UnauthenticatedStyles = styled.div`
  padding: 0 1.5rem;
  min-height: calc(100vh - 94px - 79px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
