import React from 'react';
import Link from 'next/link';
import { User } from '../../interfaces';
import { formatPhoneNumber, formatToTitleCase } from '../../utils/misc';

type Props = {
  user: User;
  sport: string;
  status: 'available' | 'unavailable';
  activeContactInfo: string | undefined;
  setActiveContactInfo: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

export default function TableRow(props: Props) {
  const sport = props.user.sports.find(
    s => s.name === formatToTitleCase(props.sport)
  );

  return (
    <tr>
      <td>
        <div className="official">
          <span className={props.status === 'available' ? 'green' : 'red'} />
          <div>
            <div className="name">
              {props.user.firstName} {props.user.lastName}{' '}
            </div>
            <div className="location">{props.user.city}</div>
          </div>
        </div>
      </td>
      <td className="level">{sport?.level}</td>
      <td className="contact">
        {props.activeContactInfo === props.user._id ? (
          <div className="contact-info">
            {props.user.cellPhone && (
              <div>
                <span className="abbreviation">Cell</span>
                {formatPhoneNumber(props.user.cellPhone)}
              </div>
            )}
            {props.user.homePhone && (
              <div>
                <span className="abbreviation">Home</span>
                {formatPhoneNumber(props.user.homePhone)}
              </div>
            )}
            {props.user.workPhone.number && (
              <div>
                <span className="abbreviation">Work</span>
                {formatPhoneNumber(props.user.workPhone.number)}
                {props.user.workPhone.extension && (
                  <span className="extension">
                    ext. {props.user.workPhone.extension}
                  </span>
                )}
              </div>
            )}
            {props.user.email && (
              <div>
                <span className="abbreviation">Email</span>
                <a
                  href={`mailto:${props.user.email}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {props.user.email}
                </a>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => props.setActiveContactInfo(props.user._id)}
            className="expand-contact-button"
          >
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
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
            <span className="sr-only">View contact info</span>
          </button>
        )}
      </td>
      <td className="view-profile">
        <Link
          href={`/calendar/${props.user._id}?s=${sport?.name.toLowerCase()}`}
        >
          <a>View profile</a>
        </Link>
      </td>
    </tr>
  );
}
