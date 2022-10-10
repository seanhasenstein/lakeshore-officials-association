import styled from 'styled-components';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import SimpleLayout from '../components/layouts/SimpleLayout';

export default function VerifyLogin() {
  return (
    <SimpleLayout title="Verify login">
      <VerifyLoginStyles>
        <div className="container">
          <div className="icon">
            <CheckCircleIcon />
          </div>
          <h2>A login link was sent to your email address</h2>
          <p>
            Go to that email and click on the link. It will take you to your
            logged in dashboard.
          </p>
        </div>
      </VerifyLoginStyles>
    </SimpleLayout>
  );
}

const VerifyLoginStyles = styled.div`
  padding: 0 1.5rem;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f3f7;

  .container {
    position: relative;
    padding: 2rem 3.5rem 3rem;
    max-width: 30rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .icon {
    display: flex;
    justify-content: center;

    svg {
      height: 2.25rem;
      width: 2.25rem;
      color: #059669;
    }
  }

  h2,
  p {
    text-align: center;
  }

  h2 {
    margin: 0.5rem 0 0;
    font-size: 1.3125rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #141a25;
  }

  p {
    margin: 1rem 0 0;
    font-size: 1.0625rem;
    color: #747b89;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1.75rem 1.5rem;
    }
  }
`;
