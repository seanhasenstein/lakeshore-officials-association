import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import styled from 'styled-components';
import { User } from '../../interfaces';
import { formatPhoneNumber, getUrlParam } from '../../utils/misc';
import { fetchUserById } from '../../utils/queries';
import FullLayout from '../../components/layouts/FullLayout';
import DirectoryCalendar from '../../components/calendar/DirectoryCalendar';

export default function OfficialCalendar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [id, setId] = React.useState<string>();

  React.useEffect(() => {
    if (router.query.id) {
      setId(getUrlParam(router.query.id));
    }
  }, [router.query.id]);

  const query = useQuery(
    ['users', 'user', id],
    () => fetchUserById(getUrlParam(id)),
    {
      initialData: () => {
        const users = queryClient.getQueryData<User[]>([
          'users',
          'sports',
          getUrlParam(router.query.s),
        ]);
        if (users) {
          return users.find(u => u._id === id);
        }
      },
      staleTime: 1000 * 60 * 5,
    }
  );

  return (
    <FullLayout
      title={query.data ? `${query.data.firstName} ${query.data.lastName}` : ''}
      authRequired={true}
    >
      <OfficialCalendarStyles>
        {query.isLoading ? 'Loading...' : null}
        {query.data ? (
          <div>
            <div>
              <h2 className="name">
                {query.data.firstName} {query.data.lastName}
              </h2>
              <p className="city">
                {query.data.city}, {query.data.state}
              </p>
            </div>
            <div className="grid-cols-2">
              <div className="calendar-section">
                {router.isReady ? (
                  <DirectoryCalendar userId={query.data._id} />
                ) : null}
              </div>
              <div className="contact-info">
                <h3>Contact information</h3>
                {query.data.email && (
                  <div className="contact-item">
                    <div className="label">Email</div>
                    <div className="value">
                      <a href={`mailto:${query.data.email}`}>
                        {query.data.email}
                      </a>
                    </div>
                  </div>
                )}
                {query.data.cellPhone && (
                  <div className="contact-item">
                    <div className="label">Cell</div>
                    <div className="value">
                      {formatPhoneNumber(query.data.cellPhone)}
                    </div>
                  </div>
                )}
                {query.data.homePhone && (
                  <div className="contact-item">
                    <div className="label">Home</div>
                    <div className="value">
                      {formatPhoneNumber(query.data.homePhone)}
                    </div>
                  </div>
                )}
                {query.data.workPhone.number && (
                  <div className="contact-item">
                    <div className="label">Work</div>
                    <div className="value">
                      {formatPhoneNumber(query.data.workPhone.number)} Ext.{' '}
                      {query.data.workPhone.extension}
                    </div>
                  </div>
                )}
                {query.data.sports.length > 0 ? (
                  <div className="contact-item">
                    <div className="label">Sports</div>
                    {query.data.sports.map(s => (
                      <div key={s.name} className="value sport">
                        {s.name} - <span className="level">{s.level}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <p className="last-updated">
              Last updated:{' '}
              {format(new Date(query.data.updatedAt), "PP 'at' h:mmaaa")}
            </p>
          </div>
        ) : null}
      </OfficialCalendarStyles>
    </FullLayout>
  );
}

const OfficialCalendarStyles = styled.div`
  margin: 0 0 3rem;

  .name {
    margin: 2.25rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #06080b;
    line-height: 1.25;
  }

  .city {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.5;
    color: #747b89;
  }

  .grid-cols-2 {
    margin: 2rem 0 0;
    padding: 2.25rem 3rem 2.75rem;
    display: grid;
    grid-template-columns: 1fr 0.75fr;
    background-color: #fdfdfd;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border-top: 1px solid #e9eaec;
  }

  .calendar-section {
    padding: 0 3.75rem 0 0;
    border-right: 1px solid #d1d5db;
  }

  .contact-info {
    margin: 0 0 0 -1px;
    padding: 2rem 0 0 3.75rem;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #d1d5db;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      line-height: 1;
    }

    .contact-item {
      margin: 2.25rem 0 0;
      display: flex;
      flex-direction: column;

      &:first-of-type {
        margin: 2rem 0 0;
      }

      .label {
        font-size: 0.9375rem;
        font-weight: 500;
        color: #6b7280;
      }

      .value {
        margin: 0.375rem 0 0;
        font-size: 0.9375rem;
        font-weight: 400;
        color: #111827;

        a:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .last-updated {
    margin: 1.75rem 0 0 0.875rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #7e8694;
  }

  @media (max-width: 1260px) {
    .grid-cols-2 {
      grid-template-columns: 1fr;
    }

    .calendar-section {
      padding: 0;
      border-right: none;
    }

    .contact-info {
      margin: 3.5rem 0 0;
      padding: 3rem 0 0;
      border-left: none;
      border-top: 1px solid #d1d5db;
    }
  }

  @media (max-width: 640px) {
    .name,
    .city {
      text-align: center;
    }

    .grid-cols-2 {
      padding: 0;
      background-color: transparent;
      border: none;
      box-shadow: none;
    }

    .last-updated {
      margin: 2.25rem 0 0;
    }
  }
`;
