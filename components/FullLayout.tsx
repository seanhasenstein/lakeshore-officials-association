import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';
import BaseLayout from './BaseLayout';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title }: Props) {
  const [showHeader, setShowHeader] = React.useState(false);

  return (
    <BaseLayout title={title}>
      <LayoutStyles>
        <Header show={showHeader} setShow={setShowHeader} />
        <div className="lg-right-column">
          <div className="sm-screen-header">
            <h2>Lakeshore Officials Association</h2>
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
          </div>
          <main>{children}</main>
          <Footer />
        </div>
      </LayoutStyles>
    </BaseLayout>
  );
}

const LayoutStyles = styled.div`
  height: 100%;

  .lg-right-column {
    padding: 4rem 4rem 0 26rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sm-screen-header {
    display: none;
  }

  @media (max-width: 768px) {
    .lg-right-column {
      padding: 0;
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
