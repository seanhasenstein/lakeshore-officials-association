import React from 'react';
import styled from 'styled-components';
import SimpleLayout from '../components/SimpleLayout';

export default function Login() {
  const [serverError] = React.useState(false);

  return (
    <SimpleLayout title="Log in">
      <LoginStyles>
        <div className="container">
          <h2>Lakeshore Officials Association</h2>
          <div>
            <div>
              <h3>Log in to your account</h3>
              <p>
                Enter the email address for your account and we&apos;ll send you
                an email to log in.
              </p>
            </div>
            <form>
              <label htmlFor="email">Email address</label>
              <input type="text" name="email" id="email" />
              <button type="submit" className="login-button">
                Email a login link
              </button>
              {serverError ? (
                <div className="error">
                  Server error. Please try again or contact the site
                  administrator.
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </LoginStyles>
    </SimpleLayout>
  );
}

const LoginStyles = styled.div`
  padding: 0 1.5rem;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f3f7;

  .container {
    padding: 3rem 3.5rem;
    max-width: 30rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  h2 {
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
    margin: 2rem 0 3rem;
    font-size: 1rem;
    color: #222c3e;
    line-height: 1.5;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  .login-button {
    margin: 1.125rem 0 0;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #222c3e;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #e4e9f0;
    cursor: pointer;
    transition: backgroun-color 150ms linear;

    &:hover {
      background-color: #1b2331;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .error {
    margin: 1rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1.75rem 1.5rem;
    }
  }
`;
