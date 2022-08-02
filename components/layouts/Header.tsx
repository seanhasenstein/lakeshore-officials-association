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
                  <span>
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Update profile
                  </span>
                </a>
              </Link>
              <Link href="/contact-admin">
                <a className="menu-link">
                  <span>
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
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                    Contact admin
                  </span>
                </a>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="menu-button"
              >
                <span>
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
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Log out
                </span>
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
    border-radius: 0.5rem;

    .menu-link,
    .menu-button {
      margin: -1px 0 0;
      padding: 0 0.875rem;
      display: flex;
      align-items: center;
      background-color: transparent;
      border: none;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #06080b;
      text-align: left;
      cursor: pointer;
      transition: background-color 75ms linear;

      &:hover {
        padding: 0;
        background-color: #dee0e3;

        &:not(:first-child) span {
          border-top-color: #d3d6da;
        }

        span {
          padding-left: 1.875rem;
          padding-right: 2.375rem;
        }
      }

      &:first-child {
        border-top-right-radius: 0.5rem;
        border-top-left-radius: 0.5rem;
      }

      &:last-child {
        border-bottom-right-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;

        span {
          border-bottom: none;
        }
      }

      svg {
        margin: 0 0.875rem 0 0;
        flex-shrink: 0;
        height: 1rem;
        width: 1rem;
        color: #898f9b;
      }

      span {
        padding: 0.8125rem 1.5rem 0.8125rem 1rem;
        display: flex;
        align-items: center;
        width: 100%;
        border-top: 1px solid transparent;
        border-bottom: 1px solid #d3d6da;
      }
    }
  }

  @media (max-width: 1024px) {
    left: -100%;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 1), 0 8px 10px -6px rgb(0 0 0 / 1);

    &.show {
      left: 0;

      .user {
        position: fixed;
        bottom: 0;
        left: 0;
        max-width: 22rem;
        width: 100%;
      }
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
      padding: 1.5rem 1.75rem;
    }

    .section:first-of-type {
      margin: 1.75rem 0 0;
    }

    nav {
      padding-bottom: 3rem;
      height: calc(100vh - 104px - 85px);
    }
  }

  @media (max-width: 375px) {
    .user {
      padding-left: 0.875rem;
      padding-right: 0.75rem;
    }
  }
`;
