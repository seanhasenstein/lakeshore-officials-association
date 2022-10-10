import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { SendEmailFormValues } from '../interfaces';
import { useSession } from 'next-auth/react';
import FullLayout from '../components/layouts/FullLayout';

const validationSchema = Yup.object().shape({
  group: Yup.string().required('A group is required'),
  subject: Yup.string().required('A subject is required'),
  body: Yup.string().required('An email body is required'),
});

const groups = [
  { id: 1, label: 'All Sports', value: 'All' },
  { id: 2, label: 'Baseball', value: 'Baseball' },
  { id: 3, label: 'Basketball', value: 'Basketball' },
  { id: 4, label: 'Football', value: 'Football' },
  { id: 5, label: 'Softball', value: 'Softball' },
  { id: 6, label: 'Volleyball', value: 'Volleyball' },
];

export default function SendEmail() {
  const session = useSession();
  const [status, setStatus] = React.useState<'idle' | 'error' | 'success'>(
    'idle'
  );

  const handleSubmit = async (formValues: SendEmailFormValues) => {
    const response = await fetch('/api/send-email', {
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
  };

  return (
    <FullLayout title="Send an email" authRequired={true}>
      <SendEmailStyles>
        {status === 'success' ? (
          <div className="success">
            <CheckCircleIcon />
            <h3>Email sent</h3>
            <p>Your email was sent successfully.</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="reset-button"
            >
              Send another email
            </button>
          </div>
        ) : (
          <>
            <h2>Send an email</h2>
            <p>Send a bulk email to a group of Lakeshore officials.</p>
            <Formik
              initialValues={{
                user: {
                  email: session.data?.user?.email || undefined,
                },
                group: '',
                subject: '',
                body: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="form-item">
                    <label htmlFor="group">To</label>
                    <Field as="select" name="group" id="group">
                      <option value="">Choose a group</option>
                      {groups.map(group => (
                        <option
                          key={group.id}
                          value={group.value}
                          className="capitalize"
                        >
                          {group.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      component="div"
                      name="group"
                      className="validation-error"
                    />
                  </div>
                  <div className="form-item">
                    <label htmlFor="subject">Subject</label>
                    <Field name="subject" id="subject" />
                    <ErrorMessage
                      component="div"
                      name="subject"
                      className="validation-error"
                    />
                  </div>
                  <div className="form-item">
                    <label htmlFor="body">Body of the email</label>
                    <Field as="textarea" name="body" id="body" />
                    <ErrorMessage
                      component="div"
                      name="body"
                      className="validation-error"
                    />
                  </div>
                  <div className="actions">
                    <button type="submit" className="submit-button">
                      {isSubmitting ? <LoadingSpinner /> : 'Send your email'}
                    </button>
                  </div>
                  {status === 'error' ? (
                    <div className="server-error">
                      Server error. Please try sending again.
                    </div>
                  ) : null}
                </Form>
              )}
            </Formik>
          </>
        )}
      </SendEmailStyles>
    </FullLayout>
  );
}

const SendEmailStyles = styled.div`
  margin: 0 0 4rem;
  padding: 1.875rem 2.25rem 1.75rem;
  max-width: 34rem;
  width: 100%;
  background-color: #fafafa;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #d4d6da;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #06080b;
  }

  p {
    margin: 0.875rem 0 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #6b7280;
  }

  form {
    margin: 2rem 0 0;
  }

  .form-item {
    margin: 1.25rem 0 0;
    display: flex;
    flex-direction: column;
  }

  textarea {
    min-height: 10rem;
  }

  .validation-error {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
  }

  .actions {
    margin: 2rem 0 0;
  }

  .submit-button {
    max-width: 11rem;
  }

  .submit-button,
  .reset-button {
    position: relative;
    padding: 0 1.125rem;
    height: 2.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
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

  .server-error {
    margin: 1.5rem 0 0;
    text-align: right;
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
  }

  .success {
    display: flex;
    flex-direction: column;
    align-items: center;

    svg {
      height: 2.5rem;
      width: 2.5rem;
      color: #059669;
    }

    h3 {
      margin: 0.5rem 0 0;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    p {
      margin: 0.75rem 0 0;
      font-size: 1.0625rem;
      color: #6c727d;
      text-align: center;

      .underline {
        text-decoration: underline;
      }
    }

    .reset-button {
      margin: 1.5rem 0 0;
    }
  }

  @media (max-width: 768px) {
    max-width: unset;
  }

  @media (max-width: 640px) {
    padding: 1.5rem 1.25rem;

    .submit-button {
      max-width: 100%;
    }

    .server-error {
      text-align: center;
      line-height: 1.35;
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
