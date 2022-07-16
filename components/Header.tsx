import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import useEscapeKeydownClose from '../hooks/useEscapeKeydownClose';
import useOutsideClick from '../hooks/useOutsideClick';
import NavLinkItem from './NavLinkItem';

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header(props: Props) {
  const router = useRouter();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLHeadingElement>(null);
  const [showMenu, setShowMenu] = React.useState(false);
  useOutsideClick(props.show, props.setShow, headerRef);
  useOutsideClick(showMenu, setShowMenu, menuRef);
  useEscapeKeydownClose(showMenu, setShowMenu);

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
          <h1>Lakeshore Officials Association</h1>
        </div>
        <nav>
          <NavLinkItem
            label="Your calendar"
            href="/"
            isActive={router.pathname === '/'}
          />
          <NavLinkItem
            label="Baseball"
            href="/baseball"
            isActive={router.query.sport === 'baseball'}
          />
          <NavLinkItem
            label="Basketball"
            href="/basketball"
            isActive={router.query.sport === 'basketball'}
          />
          <NavLinkItem
            label="Football"
            href="/football"
            isActive={router.query.sport === 'football'}
          />
          <NavLinkItem
            label="Softball"
            href="/softball"
            isActive={router.query.sport === 'softball'}
          />
          <NavLinkItem
            label="Volleyball"
            href="/volleyball"
            isActive={router.query.sport === 'volleyball'}
          />
        </nav>
      </div>
      <div className="user">
        <div className="flex-row">
          <div className="preview">TR</div>
          <div>
            <p className="name">Tom Rusch</p>
            <p className="email" title="rusch@lutheranhigh.com">
              rusch@lutheranhigh.com
            </p>
          </div>
        </div>
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
          <div ref={menuRef} className="header-menu">
            <Link href="/account">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
                Your account
              </a>
            </Link>
            <button type="button" className="logout-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Log out
            </button>
          </div>
        ) : null}
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

  .close-nav-button {
    display: none;
  }

  .brand {
    padding: 3rem 1.75rem;
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

    a {
      padding: 0.8125rem 2.5rem;
      display: flex;
      align-items: center;
      color: #b5c0d1;
      font-size: 1rem;
      font-weight: 500;
      border-left: 3px solid transparent;
      transition: color 100ms linear;

      svg {
        margin: 0 0.75rem 0 0;
        height: 1.25rem;
        width: 1.25rem;
        opacity: 0.2;
      }

      &.active {
        background-color: #202b3b;
        color: #fff;
        border-left-color: #ff441a;
      }

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
    border-radius: 0.375rem;

    a,
    button {
      padding: 0.875rem 1.25rem;
      display: flex;
      align-items: center;
      background-color: transparent;
      border: none;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #06080b;
      text-align: left;
      border-bottom: 1px solid #bec1c8;
      cursor: pointer;
      transition: all 100ms linear;

      &:hover {
        background-color: #dee0e3;
      }

      &:first-child {
        border-top-right-radius: 0.375rem;
        border-top-left-radius: 0.375rem;
      }

      &:last-child {
        border-bottom: none;
        border-bottom-right-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
        color: #000;
      }

      svg {
        margin: 0 0.4375rem 0 0;
        height: 1rem;
        width: 1rem;
        color: #9499a4;
      }
    }
  }

  @media (max-width: 768px) {
    left: -100%;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 1), 0 8px 10px -6px rgb(0 0 0 / 1);

    &.show {
      left: 0;
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
  }

  @media (max-width: 375px) {
    .user {
      padding-left: 0.875rem;
      padding-right: 0.75rem;
    }
  }
`;
