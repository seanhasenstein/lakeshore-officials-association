import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import SimpleLayout from '../components/layouts/SimpleLayout';
import { getUrlParam } from '../utils/misc';

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  if (session) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return { props: {} };
};

export default function Login() {
  const router = useRouter();
  const [invalid, setInvalid] = React.useState(false);

  React.useEffect(() => {
    if (router.isReady && router.query['invalid'] === 'true') {
      setInvalid(true);
    }
  }, [router.isReady, router.query['invalid']]);

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

            <Formik
              initialValues={{ email: getUrlParam(router.query.email) }}
              enableReinitialize={true}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email('Invalid email address')
                  .required('Email address is required'),
              })}
              onSubmit={values => {
                const email = values.email.toLowerCase().trim();
                signIn('email', { email, callbackUrl: '/' });
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <label htmlFor="email">Email address</label>
                  <Field name="email" id="email" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="validation-error"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="login-button"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner aria-hidden="true" />
                    ) : (
                      'Email a login link'
                    )}
                  </button>
                  {invalid ? (
                    <div className="invalid-error">
                      <div>The email you provided is invalid.</div>
                      <div>
                        If you think this is an error, please{' '}
                        {/* TODO: link to marketing site contact form */}
                        <Link href="/contact-us">
                          <a>let us know</a>
                        </Link>
                        . Or if you don&apos;t have an account you can{' '}
                        {/* TODO: link to marketing site contact form */}
                        <Link href="/contact-us">
                          <a>request to create one</a>
                        </Link>
                        .
                      </div>
                    </div>
                  ) : null}
                </Form>
              )}
            </Formik>
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
    padding: 3rem 3.5rem 3.25rem;
    max-width: 30rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  h2 {
    font-family: 'Teko', sans-serif;
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: 0.00625em;
    color: #222c3e;
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
    margin: 1.5rem 0 3rem;
    font-size: 1rem;
    color: #222c3e;
    line-height: 1.5;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  .login-button {
    position: relative;
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

  .validation-error,
  .invalid-error {
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
    line-height: 1.5;
  }

  .validation-error {
    margin: 0.4375rem 0 0;
  }

  .invalid-error {
    margin: 1.25rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    a {
      text-decoration: underline;
    }
  }

  @media (max-width: 640px) {
    .container {
      padding: 1.75rem 1.5rem;
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
