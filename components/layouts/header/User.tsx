import styled from 'styled-components';
import { User as UserInterface } from '../../../interfaces';
import UserMenu from './UserMenu';

type Props = {
  user: UserInterface;
};

export default function User(props: Props) {
  return (
    <UserStyles>
      <div className="flex-row">
        <div className="preview">
          {props.user.firstName[0]}
          {props.user.lastName[0]}
        </div>
        <div>
          <p className="name">
            {props.user.firstName} {props.user.lastName}
          </p>
          <p className="email" title={props.user.email}>
            {props.user.email}
          </p>
        </div>
      </div>
      <UserMenu />
    </UserStyles>
  );
}

const UserStyles = styled.div`
  padding: 1.875rem 1rem 1.875rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #141a25;

  .flex-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .preview {
    height: 2.75rem;
    width: 2.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #06080b;
    border-radius: 9999px;
    color: #fbfcfd;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .name,
  .email {
    max-width: 13rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .name {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    color: #fbfcfd;
  }

  .email {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b717e;
  }

  @media (max-width: 375px) {
    .user {
      padding-left: 0.875rem;
      padding-right: 0.75rem;
    }
  }
`;
