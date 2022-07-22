import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { useUser } from '../hooks/useUser';
import { formatPhoneNumber } from '../utils/misc';
import FullLayout from '../components/layouts/FullLayout';

export default function Profile() {
  const user = useUser();

  return (
    <FullLayout title="Profile" authRequired={true}>
      <ProfileStyles>
        {user.data ? (
          <>
            <div className="header">
              <div>
                <h2>Profile information</h2>
                <p>This information is available to all Lakeshore Officials.</p>
              </div>
              <Link href="/update-profile">
                <a className="lg-update-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Update profile
                </a>
              </Link>
            </div>
            <div className="grid">
              <div className="section">
                <div className="item">
                  <h3>Name</h3>
                  <p>
                    {user.data.firstName} {user.data.lastName}
                  </p>
                </div>
                <div className="item">
                  <h3>City</h3>
                  <p>{user.data.city}</p>
                </div>
                <div className="item">
                  <h3>Sport{user.data.sports.length > 1 ? 's' : ''}</h3>
                  {user.data.sports.map(s => (
                    <p key={s.name}>
                      {s.name} - {s.level}
                    </p>
                  ))}
                </div>
              </div>
              <div className="section">
                {user.data.homePhone ? (
                  <div className="item">
                    <h3>Home phone</h3>
                    <p>{formatPhoneNumber(user.data.homePhone)}</p>
                  </div>
                ) : null}
                {user.data.cellPhone ? (
                  <div className="item">
                    <h3>Cell phone</h3>
                    <p>{formatPhoneNumber(user.data.cellPhone)}</p>
                  </div>
                ) : null}
                {user.data.workPhone.number ? (
                  <div className="item">
                    <h3>Work phone</h3>
                    <p>
                      {formatPhoneNumber(user.data.workPhone.number)}{' '}
                      {user.data.workPhone.extension ? (
                        <span className="extension">
                          ext. {user.data.workPhone.extension}
                        </span>
                      ) : (
                        ''
                      )}
                    </p>
                  </div>
                ) : null}
                <div className="item">
                  <h3>Email address</h3>
                  <p>{user.data.email}</p>
                </div>
              </div>
              <Link href="/update-profile">
                <a className="sm-update-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Update profile
                </a>
              </Link>
            </div>
          </>
        ) : null}
      </ProfileStyles>
    </FullLayout>
  );
}

const ProfileStyles = styled.div`
  margin: 0 0 4rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    h2 {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #06080b;
    }

    p {
      margin: 0.5rem 0 0;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.5;
      color: #747b89;
    }
  }

  .sm-update-link,
  .lg-update-link {
    padding: 0.6875rem 1.125rem;
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

    svg {
      margin: 0 0.375rem 0 0;
      height: 0.875rem;
      width: 0.875rem;
      color: #6a707a;
    }
  }

  .sm-update-link {
    display: none;
  }

  .grid {
    margin: 1.875rem 0 0;
    padding: 0 2rem 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 0;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border-top: 1px solid #e9eaec;

    .item {
      margin: 2.5rem 0 0;
    }

    h3 {
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #7f8592;
    }

    p {
      margin: 0.625rem 0 0;
      font-size: 1rem;
      font-weight: 600;
      color: #06080b;

      &.city {
        margin: 0.25rem 0 0;
        color: #747b89;
        font-weight: 500;
      }

      .extension {
        margin: 0 0 0 0.3125rem;
      }
    }
  }

  @media (max-width: 640px) {
    .grid {
      padding: 0 1.5rem 1.5rem;
      display: block;

      p {
        overflow-wrap: break-word;
      }
    }

    .section {
      &:first-of-type .item {
        margin-top: 1.75rem;
      }

      &:last-of-type {
        padding-bottom: 2.25rem;
        border-bottom: 1px solid #d3d6da;
      }
    }

    .sm-update-link {
      margin: 1.5rem 0 0;
      display: flex;
    }

    .lg-update-link {
      display: none;
    }
  }
`;
