import React from 'react';
import BaseLayout from './BaseLayout';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function SimpleLayout({ children, title }: Props) {
  return (
    <BaseLayout title={title}>
      <header />
      <main>{children}</main>
      <footer />
    </BaseLayout>
  );
}
