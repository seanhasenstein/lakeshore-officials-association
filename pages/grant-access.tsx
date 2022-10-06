import React from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { User } from '../interfaces';
import { blankProfileFormValues } from '../utils/profile';
import { useUser } from '../hooks/useUser';
import FullLayout from '../components/layouts/FullLayout';
import { signIn } from 'next-auth/react';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('A valid email is required')
    .required('Email address is required'),
});

export default function GrantAccess() {
  const router = useRouter();
  const user = useUser();
  const [status, setStatus] = React.useState<'idle' | 'success'>('idle');
  const [serverError, setServerError] = React.useState<string>();

  if (user.data?.isAdmin === false) {
    router.push('/');
    return null;
  }

  return (
    <FullLayout title="Grant access" authRequired={true}>
      <GrantAccessStyles>
        {user.data?.isAdmin ? (
          <>
            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={async values => {
                const newUser = {
                  ...blankProfileFormValues,
                  email: values.email.toLowerCase().trim(),
                };

                const response = await fetch('/api/create-user', {
                  method: 'POST',
                  body: JSON.stringify(newUser),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

                if (!response.ok) {
                  const error = await response.text();
                  setServerError(error);
                  throw new Error(error);
                }

                const data: User = await response.json();

                await signIn('email', {
                  email: data.email,
                  callbackUrl: `/create-account?email=${data.email}`,
                  redirect: false,
                });

                setStatus('success');
              }}
            >
              {({ isSubmitting, values, resetForm }) => (
                <>
                  {status === 'success' ? (
                    <div className="success box">
                      <h3>
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
                        Message sent
                      </h3>
                      <p>
                        We&apos;ve sent an email to{' '}
                        <span className="underline">
                          {values.email.toLowerCase().trim()}
                        </span>{' '}
                        that will allow access to create an account.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setStatus('idle');
                        }}
                        className="reset-button button"
                      >
                        Send another email
                      </button>
                    </div>
                  ) : (
                    <div className="box">
                      <h2>Grant dashboard access</h2>
                      <p>
                        Send an email that will allow a new user to create an
                        account and gain acccess to the dashboard.
                      </p>
                      <p>*Only admin users have the ability grant access.</p>
                      <Form>
                        <div className="item">
                          <label htmlFor="email">New users email address</label>
                          <Field name="email" id="email" />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="error"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="submit-button button"
                        >
                          {isSubmitting ? (
                            <LoadingSpinner />
                          ) : (
                            'Send access email'
                          )}
                        </button>
                        {serverError ? (
                          <div className="error server-error">
                            {serverError}
                          </div>
                        ) : null}
                      </Form>
                    </div>
                  )}
                </>
              )}
            </Formik>
          </>
        ) : null}
      </GrantAccessStyles>
    </FullLayout>
  );
}

const GrantAccessStyles = styled.div`
  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #06080b;
  }

  p {
    margin: 0.875rem 0 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;
  }

  .box {
    padding: 1.75rem 2.25rem;
    max-width: 30rem;
    width: 100%;
    background-color: #fefefe;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border-top: 1px solid #e9eaec;
  }

  .item {
    margin: 2rem 0 0;
    display: flex;
    flex-direction: column;
  }

  .button {
    position: relative;
    padding: 0 1.125rem;
    height: 2.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #e6e7e9;
    background-color: #1c2a3f;
    border: none;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;
    transition: all 100ms linear;

    &:hover {
      color: #fbfbfc;
      background-color: #22334c;
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

  .submit-button {
    margin: 1.25rem 0 0;
  }

  .error {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
  }

  .server-error {
    margin: 1.125rem 0 0;
    display: flex;
    align-items: center;

    svg {
      margin: 0 0.25rem 0 0;
      height: 0.875rem;
      width: 0.875rem;
    }
  }

  .success {
    margin: 0;
    padding: 2rem;

    svg {
      height: 1.8125rem;
      width: 1.8125rem;
      color: #059669;
    }

    h3 {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    p {
      margin: 1rem 0 0;

      .underline {
        text-decoration: underline;
      }
    }

    .reset-button {
      margin: 1.375rem 0 0;
    }
  }

  @media (max-width: 1024px) {
    .box {
      max-width: 100%;
    }
  }

  @media (max-width: 640px) {
    .box {
      padding: 1.5rem 1.75rem;

      &.success {
        padding: 1.5rem;
        flex-direction: column;
        justify-content: center;
        gap: 0;
        text-align: center;
      }
    }

    .submit-button {
      display: flex;
      max-width: 100%;
      width: 100%;
    }

    .server-error {
      justify-content: center;
      text-align: center;
    }
  }
`;

const LoadingSpinner = styled.span`
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border-top: 2px solid #9499a4;
    border-right: 2px solid transparent;
    animation: spinner 0.6s linear infinite;
  }
`;
