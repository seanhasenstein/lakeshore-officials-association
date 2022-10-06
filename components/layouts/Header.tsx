import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import styled from 'styled-components';
import { useUser } from '../../hooks/useUser';
import useEscapeKeydownClose from '../../hooks/useEscapeKeydownClose';
import useOutsideClick from '../../hooks/useOutsideClick';
import usePreventYScroll from '../../hooks/usePreventYScroll';
import NavLinkItem from './NavLinkItem';

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header(props: Props) {
  const router = useRouter();
  const user = useUser();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLHeadingElement>(null);
  const [showMenu, setShowMenu] = React.useState(false);
  useOutsideClick(props.show, props.setShow, headerRef);
  useOutsideClick(showMenu, setShowMenu, menuRef);
  useEscapeKeydownClose(showMenu, setShowMenu);
  usePreventYScroll(props.show);

  React.useEffect(() => {
    props.setShow(false);
  }, [router.query.sport]);

  return (
    <HeaderStyles ref={headerRef} className={props.show ? 'show' : ''}>
      <div>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            props.setShow(false);
          }}
          className="close-nav-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close navigation</span>
        </button>
        <div className="brand">
          <h1>
            <Link href="/">
              <a>Lakeshore Officials Association</a>
            </Link>
          </h1>
        </div>
        <nav>
          <div className="section">
            <h3>
              {router.query.sport &&
              [
                'baseball',
                'basketball',
                'football',
                'softball',
                'volleyball',
              ].includes(
                Array.isArray(router.query.sport)
                  ? router.query.sport[0]
                  : router.query.sport
              ) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                    clipRule="evenodd"
                  />
                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              )}
              Sports directories
            </h3>
            <ul>
              <NavLinkItem
                label="Baseball"
                href="/directory/baseball"
                isActive={router.query.sport === 'baseball'}
              />
              <NavLinkItem
                label="Basketball"
                href="/directory/basketball"
                isActive={router.query.sport === 'basketball'}
              />
              <NavLinkItem
                label="Football"
                href="/directory/football"
                isActive={router.query.sport === 'football'}
              />
              <NavLinkItem
                label="Softball"
                href="/directory/softball"
                isActive={router.query.sport === 'softball'}
              />
              <NavLinkItem
                label="Volleyball"
                href="/directory/volleyball"
                isActive={router.query.sport === 'volleyball'}
              />
            </ul>
          </div>
          <div className="section">
            <h3>
              {router.pathname === '/' ||
              router.pathname === '/send-email' ||
              router.pathname === '/grant-access' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                    clipRule="evenodd"
                  />
                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              )}
              Your account
            </h3>
            <ul>
              <NavLinkItem
                label="Profile/Calendar"
                href="/"
                isActive={router.pathname === '/'}
              />
              <NavLinkItem
                label="Send an email"
                href="/send-email"
                isActive={router.pathname === '/send-email'}
              />
              {user.data?.isAdmin ? (
                <NavLinkItem
                  label="Grant site access"
                  href="/grant-access"
                  isActive={router.pathname === '/grant-access'}
                />
              ) : null}
            </ul>
          </div>
        </nav>
      </div>
      <div className="user">
        <div className="flex-row">
          <div className="preview">
            {user.data?.firstName[0]}
            {user.data?.lastName[0]}
          </div>
          <div>
            <p className="name">
              {user.data?.firstName} {user.data?.lastName}
            </p>
            <p className="email" title={user.data?.email}>
              {user.data?.email}
            </p>
          </div>
        </div>
        <div ref={menuRef}>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="nav-menu-button"
          >
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
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </button>
          {showMenu ? (
            <div className="header-menu">
              <Link href="/update-profile">
                <a className="menu-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Update your profile
                </a>
              </Link>
              <Link href="/contact-admin">
                <a className="menu-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                  Contact site admin
                </a>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="menu-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </HeaderStyles>
  );
}

const HeaderStyles = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  max-width: 22rem;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #162131;
  z-index: 9999;

  .close-nav-button {
    display: none;
  }

  .brand {
    padding: 3rem 2rem 0;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.25;
    color: #eef2f6;
  }

  nav {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 108px - 104px);
    overflow-y: auto;
  }

  .section {
    margin: 3.25rem 0 0;
    padding: 0 2.25rem;

    h3 {
      display: flex;
      gap: 0.8125rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #f1f3f7;

      svg {
        height: 1.25rem;
        width: 1.25rem;
        color: #b5c0d1;
        opacity: 0.25;
      }
    }

    ul {
      margin: 1rem 0 0 0;
      padding: 0 0 0 0.5rem;
    }

    li {
      padding: 0;
      list-style-type: none;
      line-height: 1;
      background-color: transparent;

      &.active {
        a {
          background-color: #202b3b;
          border-left-color: #ff441a;
          color: #fff;
        }
      }
    }

    a {
      padding: 0.8125rem 0 0.8125rem 1.875rem;
      display: block;
      background-color: transparent;
      color: #b5c0d1;
      font-size: 1rem;
      font-weight: 500;
      border-left: 2px solid rgba(181, 192, 209, 0.1);
      transition: color 100ms linear;

      &:hover {
        color: #edf1f7;
      }
    }
  }

  .user {
    padding: 1.875rem 1rem 1.875rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #141a25;
  }

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

  .nav-menu-button {
    padding: 0;
    height: 2rem;
    width: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    border-radius: 9999px;
    color: #9ea3ad;
    cursor: pointer;
    transition: all 100ms linear;

    svg {
      height: 1.375rem;
      width: 1.375rem;
    }

    &:hover {
      color: #fff;
    }
  }

  .header-menu {
    position: absolute;
    right: 3.25rem;
    bottom: 2.25rem;
    display: flex;
    flex-direction: column;
    background-color: #e9eaec;
    border-radius: 0.3125rem;

    .menu-link,
    .menu-button {
      padding: 0.875rem 1.625rem 0.875rem 1.25rem;
      display: flex;
      align-items: center;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #d3d6da;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #000;
      text-align: left;
      cursor: pointer;
      transition: background-color 75ms linear;

      &:hover {
        background-color: #dee0e3;
      }

      &:first-child {
        border-top-right-radius: 0.31255rem;
        border-top-left-radius: 0.31255rem;
      }

      &:last-child {
        border-bottom-right-radius: 0.31255rem;
        border-bottom-left-radius: 0.31255rem;
      }

      svg {
        margin: 0 0.75rem 0 0;
        flex-shrink: 0;
        height: 1rem;
        width: 1rem;
        color: #9499a4;
      }
    }
  }

  @media (max-width: 1024px) {
    left: -100%;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 1), 0 8px 10px -6px rgb(0 0 0 / 1);

    &.show {
      left: 0;
      max-width: unset;
    }

    .close-nav-button {
      display: flex;
      position: absolute;
      top: 1.625rem;
      right: 1.25rem;
      background-color: transparent;
      border: none;
      color: #6b717e;
      cursor: pointer;

      svg {
        height: 1.375rem;
        width: 1.375rem;
      }
    }

    .brand {
      display: none;
    }

    .section:first-of-type {
      margin: 1.75rem 0 0;
    }

    nav {
      padding-bottom: 3rem;
      height: unset;
    }
  }

  @media (max-width: 375px) {
    .user {
      padding-left: 0.875rem;
      padding-right: 0.75rem;
    }
  }
`;
