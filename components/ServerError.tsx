import Link from 'next/link';
import styled from 'styled-components';

export default function ServerError() {
  return (
    <ServerErrorStyles>
      <p>
        Internal server error. Check your internet connection and try reloading
        the page. If your problem continues please{' '}
        <Link href="/contact">
          <a>contact us</a>
        </Link>
        .
      </p>
    </ServerErrorStyles>
  );
}

const ServerErrorStyles = styled.div`
  max-width: 32rem;

  p {
    color: #be123c;
    line-height: 1.5;
  }

  a {
    text-decoration: underline;
  }
`;
