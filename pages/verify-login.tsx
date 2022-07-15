import styled from "styled-components";
import SimpleLayout from "../components/SimpleLayout";

export default function VerifyLogin() {
  return (
    <SimpleLayout title="Verify login">
      <VerifyLoginStyles>
        <div className="container">
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2>Login link sent</h2>
          <h3>Please check your email</h3>
          <p>
            We sent you an email that contains a link. Go to that email and
            click on the link to log in.
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
    padding: 3rem 3.5rem;
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
    align-items: center;

    svg {
      height: 2.25rem;
      width: 2.25rem;
      color: #059669;
    }
  }

  h2,
  h3,
  p {
    text-align: center;
  }

  h2 {
    margin: 1rem 0 0;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #141a25;
  }

  h3 {
    margin: 1.5rem 0 0;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #7f8592;
  }

  p {
    margin: 2rem 0 0;
    font-size: 1rem;
    color: #222c3e;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1.75rem 1.5rem;
    }
  }
`;
