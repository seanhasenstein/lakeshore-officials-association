import React from 'react';
import styled from 'styled-components';
import BasicTopHeaderLayout from '../components/layouts/BasicTopHeaderLayout';
import ContactAdminForm from '../components/forms/ContactAdminForm';

export default function ContactAdministrator() {
  return (
    <BasicTopHeaderLayout title="Contact administrator">
      <ConctactAdminStyles>
        <ContactAdminForm formTitle="Contact us" />
      </ConctactAdminStyles>
    </BasicTopHeaderLayout>
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
