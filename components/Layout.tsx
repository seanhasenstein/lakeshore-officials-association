import React from "react";
import Head from "next/head";
import { GlobalStyles } from "../styles/GlobalStyles";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styled from "styled-components";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <LayoutStyles>
      <Head>
        <title>Lakeshore Officials Association</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyles />
      <Header />
      <div className="lg-right-column">
        <main>{children}</main>
        <Footer />
      </div>
    </LayoutStyles>
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
`;
