import Link from 'next/link';
import styled from 'styled-components';

export default function Footer() {
  return (
    <FooterStyles>
      <p>&copy; {new Date().getFullYear()} Lakeshore Officials Association</p>
      <div className="nav">
        <Link href="/terms-and-conditions">
          <a>Terms &amp; conditions</a>
        </Link>
        <Link href="/privacy-policy">
          <a>Privacy policy</a>
        </Link>
      </div>
    </FooterStyles>
  );
}

const FooterStyles = styled.footer`
  padding: 1.875rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

  @media (max-width: 768px) {
    padding: 2.25rem 0;
    flex-direction: column-reverse;

    p {
      margin: 2.5rem 0 0;
    }
  }
`;
