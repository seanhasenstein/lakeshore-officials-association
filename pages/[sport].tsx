import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import FullLayout from '../components/FullLayout';
import { Sport } from '../interfaces';
import {
  formatPhoneNumber,
  formatToTitleCase,
  getUrlParam,
} from '../utils/misc';
import { fetchUsersBySport } from '../utils/queries';

export default function SportPage() {
  const router = useRouter();
  const [sport, setSport] = React.useState<string>();
  const { data, isLoading } = useQuery(
    ['users', sport],
    () => fetchUsersBySport(sport as Sport | undefined),
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  React.useEffect(() => {
    if (router.isReady && router.query.sport) {
      setSport(getUrlParam(router.query.sport));
    }
  }, [router.isReady, router.query.sport]);

  return (
    <FullLayout title={sport ? formatToTitleCase(sport) : ''}>
      <SportPageStyles>
        {isLoading ? 'Loading...' : ''}
        {data && sport ? (
          <>
            <h3>{formatToTitleCase(sport)} directory</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name/City</th>
                    <th>Level</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(v => {
                    const s = v.sports.find(
                      s => s.name === formatToTitleCase(sport)
                    );
                    return (
                      <tr key={v._id}>
                        <td>
                          <div className="name">
                            {v.firstName} {v.lastName}
                          </div>
                          <div className="city">{v.city}</div>
                        </td>
                        <td>{s?.level}</td>
                        <td>
                          <div className="phone-numbers">
                            {v.homePhone && (
                              <div>
                                <span className="abbreviation">H:</span>
                                {formatPhoneNumber(v.homePhone)}
                              </div>
                            )}
                            {v.cellPhone && (
                              <div>
                                <span className="abbreviation">C:</span>
                                {formatPhoneNumber(v.cellPhone)}
                              </div>
                            )}
                            {v.workPhone.number && (
                              <div>
                                <span className="abbreviation">W:</span>
                                {formatPhoneNumber(v.workPhone.number)}
                                {v.workPhone.extension && (
                                  <span className="extension">
                                    ext. {v.workPhone.extension}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <a
                            href={`mailto:${v.email}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {v.email}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </SportPageStyles>
    </FullLayout>
  );
}

const SportPageStyles = styled.div`
  margin: 0 0 5rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #06080b;
  }

  .table-container {
    margin: 2rem 0 0;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.15);
    border-width: 2px 1px 1px 1px;
    border-style: solid;
    border-color: #e9eaec;
    border-radius: 0.5rem;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th {
    padding: 0.875rem 1.5rem;
    text-align: left;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #747b89;
    background-color: #f1f3f7;
    border-bottom: 2px solid rgba(228, 233, 240, 0.75);

    &:first-of-type {
      border-top-left-radius: 0.5rem;
    }

    &:last-of-type {
      border-top-right-radius: 0.5rem;
    }
  }

  td {
    padding: 0.875rem 1.5rem;
    background-color: #fff;
    border-bottom: 2px solid rgba(228, 233, 240, 0.75);
    font-size: 0.875rem;
    font-weight: 500;
    color: #141a25;

    .name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #06080b;
    }

    .city {
      margin: 0.1875rem 0 0;
      color: #9499a4;
    }

    .phone-numbers {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .number {
        display: flex;
        align-items: center;
      }

      .abbreviation {
        display: inline-block;
        width: 1.375rem;
        color: #9499a4;
      }

      .extension {
        margin: 0 0 0 0.625rem;
      }
    }

    a:hover {
      text-decoration: underline;
    }
  }

  tbody {
    tr {
      &:last-of-type {
        td {
          border-bottom: none;

          &:first-of-type {
            border-bottom-left-radius: 0.5rem;
          }

          &:last-of-type {
            border-bottom-right-radius: 0.5rem;
          }
        }
      }

      &:hover {
        td {
          background-color: #fbfbfb;
        }
      }
    }
  }
`;
