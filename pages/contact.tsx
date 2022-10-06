import styled from 'styled-components';
import ContactAdminForm from '../components/forms/ContactAdminForm';
import FullLayout from '../components/layouts/FullLayout';

export default function ContactAdmin() {
  return (
    <FullLayout title="Contact admin" authRequired={true}>
      <ContactAdminStyles>
        <ContactAdminForm formTitle="Contact site admin" />
      </ContactAdminStyles>
    </FullLayout>
  );
}

const ContactAdminStyles = styled.div`
  margin: 0 0 3rem;
  max-width: 38rem;
  width: 100%;

  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;
