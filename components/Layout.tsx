import React from "react";
import Head from "next/head";
import { GlobalStyles } from "../styles/GlobalStyles";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Lakeshore Officials Association</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyles />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
