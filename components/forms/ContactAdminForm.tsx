import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { removeNonDigits } from '../../utils/misc';

export const validationSchema = Yup.object().shape({
  fullname: Yup.string().required('Your name is required'),
  subject: Yup.string().required('A subject is required'),
  customSubject: Yup.string().when('subject', {
    is: 'other',
    then: Yup.string().required('A custom subject is required'),
  }),
  phone: Yup.string()
    .transform(value => {
      return removeNonDigits(value);
    })
    .matches(new RegExp(/^\d{10}$/), 'Must be a valid 10 digit number'),
  email: Yup.string()
    .email('A valid email is required')
    .required('Your email is required'),
  message: Yup.string().required('A message is required'),
});

type Props = {
  formTitle: string;
};

export default function ContactAdminForm(props: Props) {
  const [status, setStatus] = React.useState<'idle' | 'error' | 'success'>(
    'idle'
  );

  return (
    <ContactAdminFormStyles>
      {status === 'success' ? (
        <div className="box success">
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
          <div>
            <h3>Message sent!</h3>
            <p>
              Thanks for reaching out. We&apos;ll be with you as soon as we can.
            </p>
          </div>
        </div>
      ) : (
        <>
          <h2>{props.formTitle}</h2>
          <p>
            Use this form for any questions that you have, to report a bug, or
            to request access to the site.
          </p>
          <div className="box">
            <Formik
              initialValues={{
                fullname: '',
                subject: '',
                customSubject: '',
                email: '',
                phone: '',
                message: '',
              }}
              validationSchema={validationSchema}
              onSubmit={async formValues => {
                const response = await fetch('/api/contact-admin', {
                  method: 'POST',
                  body: JSON.stringify(formValues),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

                if (!response.ok) {
                  setStatus('error');
                  return;
                }

                setStatus('success');
              }}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <div className="item">
                    <label htmlFor="fullname">Your name</label>
                    <Field name="fullname" id="fullname" />
                    <ErrorMessage
                      component="div"
                      name="fullname"
                      className="error"
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="subject">Subject</label>
                    <Field as="select" name="subject" id="subject">
                      <option value="">Choose a subject</option>
                      <option value="account">
                        I want to create an account
                      </option>
                      <option value="bug">Report a bug</option>
                      <option value="other">Other</option>
                    </Field>
                    <ErrorMessage
                      component="div"
                      name="subject"
                      className="error"
                    />
                  </div>
                  {values.subject === 'other' ? (
                    <div className="item">
                      <label htmlFor="customSubject">Other subject</label>
                      <Field name="customSubject" id="customSubject" />
                      <ErrorMessage
                        component="div"
                        name="customSubject"
                        className="error"
                      />
                    </div>
                  ) : null}
                  <div className="grid-cols-2">
                    <div className="item">
                      <label htmlFor="email">Email address</label>
                      <Field name="email" id="email" />
                      <ErrorMessage
                        component="div"
                        name="email"
                        className="error"
                      />
                    </div>
                    <div className="item">
                      <label htmlFor="phone">Phone number</label>
                      <Field name="phone" id="phone" />
                      <ErrorMessage
                        component="div"
                        name="phone"
                        className="error"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <label htmlFor="message">Your message</label>
                    <Field as="textarea" name="message" id="message" />
                    <ErrorMessage
                      component="div"
                      name="message"
                      className="error"
                    />
                  </div>
                  <div className="actions">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="submit-button"
                    >
                      {isSubmitting ? <LoadingSpinner /> : 'Send your message'}
                    </button>
                  </div>
                  {status === 'error' ? (
                    <p className="server-error error">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Server error. Please try sending again.
                    </p>
                  ) : null}
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
    </ContactAdminFormStyles>
  );
}

const ContactAdminFormStyles = styled.div`
  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #06080b;
  }

  p {
    margin: 1rem 0 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;
  }

  .box {
    margin: 2rem 0 0;
    padding: 1rem 2rem 2rem;
    max-width: 38rem;
    width: 100%;
    background-color: #fafafa;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border: 1px solid #d4d6da;
  }

  .grid-cols-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: 0 1.5rem;
  }

  .item {
    margin: 1.25rem 0 0;
    display: flex;
    flex-direction: column;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }

  .submit-button {
    margin: 1.625rem 0 0;
    position: relative;
    padding: 0 1.125rem;
    height: 2.5rem;
    max-width: 15rem;
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

  .error {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
  }

  .server-error {
    margin: 1.25rem 0 0;
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
    display: flex;
    gap: 1rem;

    .icon {
      svg {
        height: 1.875rem;
        width: 1.875rem;
        color: #059669;
      }
    }

    h3 {
      font-size: 1.25rem;
    }

    p {
      margin: 0.5rem 0 0;
    }
  }

  @media (max-width: 1024px) {
    .box {
      max-width: 100%;
    }
  }

  @media (max-width: 640px) {
    .box {
      padding: 0.3125rem 1.5rem 1.5rem;

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
