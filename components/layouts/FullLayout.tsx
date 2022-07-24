import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Header from '../Header';
import Footer from '../Footer';
import styled from 'styled-components';
import useAuthSession from '../../hooks/useAuthSession';
import BaseLayout from './BaseLayout';

type Props = {
  children: React.ReactNode;
  title?: string;
  authRequired: boolean;
};

export default function FullLayout({ children, title, authRequired }: Props) {
  const { status: authStatus } = useSession();
  const [session, sessionIsLoading] = useAuthSession({
    required: authRequired,
  });
  const [showHeader, setShowHeader] = React.useState(false);

  if (authRequired && (sessionIsLoading || !session)) return <div />;

  return (
    <BaseLayout title={title}>
      <FullLayoutStyles>
        <Header show={showHeader} setShow={setShowHeader} />
        <div className="sm-screen-header">
          <h2>
            <Link href="/">
              <a>Lakeshore Officials Association</a>
            </Link>
          </h2>
          {authStatus === 'authenticated' ? (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setShowHeader(!showHeader);
              }}
              className={`nav-toggle-button ${showHeader ? 'hide' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Toggle navigation</span>
            </button>
          ) : null}
        </div>
        <div className="lg-right-column">
          <main>{children}</main>
          <Footer />
        </div>
      </FullLayoutStyles>
    </BaseLayout>
  );
}

const FullLayoutStyles = styled.div`
  height: 100%;

  .lg-right-column {
    padding: 5rem 4rem 0 26rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sm-screen-header {
    display: none;
  }

  @media (max-width: 1024px) {
    height: auto;

    .lg-right-column {
      min-height: calc(100vh - 105px);
      padding: 2.5rem 1.5rem 0;
    }

    .sm-screen-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #162131;

      h2 {
        width: 12rem;
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.025em;
        color: #eef2f6;
      }
    }

    .nav-toggle-button {
      padding: 1rem 0 1rem 1rem;
      background-color: transparent;
      border: none;
      color: #7a7a7e;
      cursor: pointer;

      &.hide {
        display: none;
      }

      svg {
        height: 1.375rem;
        width: 1.375rem;
      }
    }
  }
`;
