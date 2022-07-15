import Link from "next/link";
import styled from "styled-components";
import SimpleLayout from "../components/SimpleLayout";

export default function Unauthorized() {
  return (
    <SimpleLayout title="Unauthorized">
      <UnauthorizedStyles>
        <div className="container">
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2>Unauthorized</h2>
          <p>Access denied. You must be logged in to continue.</p>
          <Link href="/login">
            <a className="login-link">Go to log in</a>
          </Link>
        </div>
      </UnauthorizedStyles>
    </SimpleLayout>
  );
}

const UnauthorizedStyles = styled.div`
  padding: 0 1.5rem;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f3f7;

  .container {
    position: relative;
    padding: 3rem 5rem;
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
    height: 2.25rem;
    width: 2.25rem;
    background-color: #ffe4e6;
    border-radius: 9999px;

    svg {
      height: 1.625rem;
      width: 1.625rem;
      color: #be123c;
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
    margin: 1.5rem 0 0;
    font-size: 1rem;
    color: #222c3e;
    line-height: 1.5;
  }

  .login-link {
    margin: 2rem 0 0;
    height: 2.5rem;
    width: 100%;
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

  @media (max-width: 640px) {
    .container {
      padding: 1.75rem 1.5rem;
    }
  }
`;
