import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { FolderOpenIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useUser } from '../../../hooks/useUser';
import useOutsideClick from '../../../hooks/useOutsideClick';
import usePreventYScroll from '../../../hooks/usePreventYScroll';
import NavLinkItem from '../NavLinkItem';
import User from './User';

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header(props: Props) {
  const router = useRouter();
  const user = useUser();
  const headerRef = React.useRef<HTMLHeadingElement>(null);
  useOutsideClick(props.show, props.setShow, headerRef);
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
          <XMarkIcon />
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
                <FolderOpenIcon />
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
                <FolderOpenIcon />
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
                label="Your profile"
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
                  label="Grant access"
                  href="/grant-access"
                  isActive={router.pathname === '/grant-access'}
                />
              ) : null}
            </ul>
          </div>
        </nav>
      </div>
      {user.data ? <User user={user.data} /> : null}
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
    padding: 3rem 2.25rem 0;
  }

  h1 {
    font-family: 'Teko', sans-serif;
    font-size: 1.875rem;
    font-weight: 500;
    letter-spacing: 0.025em;
    line-height: 1.125;
    color: #eef2f6;
  }

  nav {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 108px - 104px);
    overflow-y: auto;
  }

  .section {
    margin: 2.875rem 0 0;
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
      color: #9ca3af;
      cursor: pointer;

      svg {
        height: 1.75rem;
        width: 1.75rem;
      }
    }

    .brand {
      display: none;
    }

    .section:first-of-type {
      margin: 1.75rem 0 0;
    }

    nav {
      padding-bottom: 22rem;
      height: unset;
    }
  }
`;
