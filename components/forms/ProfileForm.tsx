import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { ProfileFormValues } from '../../interfaces';
import { validationSchema } from '../../utils/profile';
import { unitedStates } from '../../utils/states';

type Props = {
  initialValues: ProfileFormValues;
  onSubmit: (
    values: ProfileFormValues,
    actions: FormikHelpers<ProfileFormValues>
  ) => void;
  serverError: string | undefined;
};

export default function ProfileForm(props: Props) {
  const router = useRouter();

  return (
    <ProfileFormStyles>
      <div className="instructions">
        <h3>Contact information</h3>
        <p>
          This information will be available to all Lakeshore Officials that
          have an account on this platform.
        </p>
      </div>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => props.onSubmit(values, actions)}
      >
        {({ values, setFieldValue, isSubmitting, errors, submitCount }) => (
          <Form>
            <div className="grid-cols-2">
              <div className="item">
                <label htmlFor="firstName">First name</label>
                <Field name="firstName" id="firstName" />
                <ErrorMessage
                  component="div"
                  className="error"
                  name="firstName"
                />
              </div>
              <div className="item">
                <label htmlFor="lastName">Last name</label>
                <Field name="lastName" id="lastName" />
                <ErrorMessage
                  component="div"
                  className="error"
                  name="lastName"
                />
              </div>
            </div>
            <div className="grid-cols-2">
              <div className="item">
                <label htmlFor="email">Email address</label>
                <Field name="email" id="email" />
                <ErrorMessage component="div" className="error" name="email" />
              </div>
              <div className="item">
                <label htmlFor="phone">Phone</label>
                <Field name="phone" id="phone" />
                <ErrorMessage component="div" className="error" name="phone" />
              </div>
            </div>
            <h4>Address</h4>
            <div className="grid-cols-2">
              <div className="item">
                <label htmlFor="address.street">Street</label>
                <Field name="address.street" id="address.street" />
                <ErrorMessage
                  component="div"
                  className="error"
                  name="address.street"
                />
              </div>
              <div className="item">
                <label htmlFor="address.street2">Line 2</label>
                <Field name="address.street2" id="address.street2" />
              </div>
            </div>
            <div className="grid-cols-2">
              <div className="item">
                <label htmlFor="address.city">City</label>
                <Field name="address.city" id="address.city" />
                <ErrorMessage
                  component="div"
                  className="error"
                  name="address.city"
                />
              </div>
              <div className="item">
                <label htmlFor="address.state">State</label>
                <Field as="select" name="address.state" id="address.state">
                  <option value="">Select your state</option>
                  {unitedStates.map(s => (
                    <option key={s.value} value={s.text}>
                      {s.text}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  component="div"
                  className="error"
                  name="address.state"
                />
              </div>
            </div>
            <div className="item">
              <label htmlFor="address.zipcode">Zipcode</label>
              <Field name="address.zipcode" id="address.zipcode" />
              <ErrorMessage
                component="div"
                className="error"
                name="address.zipcode"
              />
            </div>
            <div className="sports">
              <div className="instructions">
                <h3>Sports</h3>
                <p>
                  Select a level for all of the sports that you currently
                  officiate.
                </p>
              </div>
              {values.sports.map(sport => (
                <div key={sport.name} className="item">
                  <label htmlFor={sport.name}>{sport.name}</label>
                  <select
                    name={sport.name}
                    id={sport.name}
                    value={sport.level}
                    onChange={e => {
                      const sports = values.sports.map(s => {
                        if (s.name === sport.name) {
                          return { name: s.name, level: e.target.value };
                        } else {
                          return s;
                        }
                      });

                      setFieldValue('sports', sports);
                    }}
                  >
                    <option value="default">Select a level</option>
                    <option value="NAO">Not an official</option>
                    <option value="L0">L0</option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="L4">L4</option>
                    <option value="L5">L5</option>
                    <option value="MS">Master</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="actions">
              {router.pathname === '/create-account' ? (
                <>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button"
                  >
                    {isSubmitting ? <LoadingSpinner /> : 'Create your account'}
                  </button>
                </>
              ) : null}
              {router.pathname === '/update-profile' ? (
                <>
                  {isSubmitting ? null : (
                    <Link href="/">
                      <a className="cancel-link">Cancel</a>
                    </Link>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button"
                  >
                    {isSubmitting ? <LoadingSpinner /> : 'Update your profile'}
                  </button>
                </>
              ) : null}
            </div>
            {submitCount > 0 && Object.keys(errors).length > 0 ? (
              <div className="error validation-check">
                You have validation errors above to fix before you can submit
                your update.
              </div>
            ) : null}
            {props.serverError ? (
              <div className="error server-error">
                {props.serverError} Please{' '}
                <Link href="/contact">
                  <a>contact us</a>
                </Link>{' '}
                if this issue continues or if you have questions.
              </div>
            ) : null}
          </Form>
        )}
      </Formik>
    </ProfileFormStyles>
  );
}

const ProfileFormStyles = styled.div`
  margin: 2.25rem 0 0;
  padding: 2.25rem;
  max-width: 38rem;
  width: 100%;
  background-color: #fafafa;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #d4d6da;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1c2a3f;
  }

  h4 {
    margin: 2.25rem 0 0;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #1c2a3f;
  }

  p {
    margin: 0.875rem 0 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;
  }

  .instructions {
    margin: 0 0 1.25rem;
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

  .sports {
    margin: 2.5rem 0 0;
  }

  .actions {
    margin: 1.625rem 0 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1.25rem;
  }

  .cancel-link {
    padding: 0 1.25rem;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: 1px solid #c9cbd1;
    font-size: 0.875rem;
    font-weight: 500;
    color: #1c2a3f;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    transition: all 100ms linear;

    &:hover {
      background-color: #f9f9f9;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 2px 3px 0px;
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
    line-height: 1.5;
  }

  .validation-check {
    margin: 1.5rem 0 0;
    text-align: center;
  }

  .server-error {
    margin: 1.5rem 0 0;

    a {
      text-decoration: underline;
    }
  }

  @media (max-width: 1024px) {
    max-width: 100%;
  }

  @media (max-width: 640px) {
    padding: 1.5rem;

    .actions {
      margin: 2.25rem 0 0;
      padding: 1.25rem 0 0;
      border-top: 1px solid #e6e7e9;
      flex-direction: column;
      gap: 1rem;
    }

    .cancel-link,
    .submit-button {
      display: flex;
      max-width: 100%;
      width: 100%;
    }

    .error {
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
