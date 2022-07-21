import React from 'react';
import styled from 'styled-components';
import SimpleVerticalLayout from '../components/layouts/SimpleVerticalLayout';
import ContactAdminForm from '../components/forms/ContactAdminForm';

export default function ContactAdministrator() {
  return (
    <SimpleVerticalLayout title="Contact administrator">
      <ConctactAdminStyles>
        <ContactAdminForm />
      </ConctactAdminStyles>
    </SimpleVerticalLayout>
  );
}

const ConctactAdminStyles = styled.div`
  margin: 5rem auto;
  padding: 0 1.5rem;
  max-width: 38rem;
  width: 100%;

  @media (max-width: 1024px) {
    margin: 3rem auto;
  }
`;
