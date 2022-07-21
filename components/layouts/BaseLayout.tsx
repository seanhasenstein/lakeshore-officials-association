import React from 'react';
import Head from 'next/head';
import { GlobalStyles } from '../../styles/GlobalStyles';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function BaseLayout({ children, title }: Props) {
  return (
    <>
      <Head>
        <title>
          {`${title ? `${title} | ` : ''}Lakeshore Officials Association`}
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyles />
      {children}
    </>
  );
}
