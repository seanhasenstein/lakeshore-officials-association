import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import BaseLayout from './BaseLayout';
import Footer from '../Footer';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function SimpleVerticalLayout({ children, title }: Props) {
  return (
    <BaseLayout title={title}>
      <SimpleVerticalLayoutStyles>
        <div>
          <header>
            <h1>
              <Link href="/">
                <a>Lakeshore Officials Association</a>
              </Link>
            </h1>
          </header>
          <main>{children}</main>
        </div>
        <Footer />
      </SimpleVerticalLayoutStyles>
    </BaseLayout>
  );
}

const SimpleVerticalLayoutStyles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  header {
    padding: 2rem 0;
    background-color: #162131;
    display: flex;
    justify-content: center;

    h1 {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      line-height: 1.25;
      color: #eef2f6;
      text-align: center;
    }
  }

  footer {
    margin: 0 auto;
    width: calc(100% - 3rem);
    text-align: center;
  }
`;
