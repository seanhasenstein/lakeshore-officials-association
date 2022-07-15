import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";
import BaseLayout from "./BaseLayout";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title }: Props) {
  return (
    <BaseLayout title={title}>
      <LayoutStyles>
        <Header />
        <div className="lg-right-column">
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
`;
