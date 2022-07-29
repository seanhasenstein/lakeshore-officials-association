import styled from 'styled-components';

export default function Footer() {
  return (
    <FooterStyles>
      <p>&copy; {new Date().getFullYear()} Lakeshore Officials Association</p>
    </FooterStyles>
  );
}

const FooterStyles = styled.footer`
  padding: 1.875rem 0;
  border-top: 1px solid #d3d6da;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #898f9b;

  a {
    padding: 0 1.5rem;
    font-weight: 600;
    color: #474b54;
    border-right: 2px solid #d3d6da;
    transition: color 100ms linear;

    &:first-of-type {
      padding-left: 0;
    }

    &:last-of-type {
      padding-right: 0;
      border-right: none;
    }

    &:hover {
      color: #1a1c1f;
    }
  }

  @media (max-width: 1024px) {
    padding: 2.25rem 0;
    text-align: center;
  }
`;
