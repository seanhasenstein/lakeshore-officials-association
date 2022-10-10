import styled from 'styled-components';
import { signOut } from 'next-auth/react';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import MenuItemLink from '../../common/MenuItemLink';

export default function HeaderUserMenu() {
  return (
    <HeaderUserMenuStyles>
      <Menu>
        <Menu.Button className="nav-menu-button">
          <EllipsisVerticalIcon strokeWidth={2} />
          <span className="sr-only">Toggle menu</span>
        </Menu.Button>
        <Menu.Items className="user-menu">
          <Menu.Item>
            {({ active }) => (
              <MenuItemLink
                href="/update-profile"
                className={`user-menu-link${active ? ' active' : ''}`}
              >
                Update your account
              </MenuItemLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <MenuItemLink
                href="/contact"
                className={`user-menu-link${active ? ' active' : ''}`}
              >
                Contact us
              </MenuItemLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => signOut()}
                className={`user-menu-button${active ? ' active' : ''}`}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </HeaderUserMenuStyles>
  );
}

const HeaderUserMenuStyles = styled.div`
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
      height: 1.5rem;
      width: 1.5rem;
    }

    &:hover {
      color: #fff;
    }
  }

  .user-menu {
    position: absolute;
    right: 3.25rem;
    bottom: 2.25rem;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 0.3125rem;

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    .user-menu-link,
    .user-menu-button {
      padding: 0.875rem 1.625rem;
      display: flex;
      align-items: center;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
      font-weight: 400;
      color: #000;
      text-align: left;
      cursor: pointer;
      transition: background-color 75ms linear;

      &.active,
      &:hover {
        background-color: #f3f4f6;
      }

      &:first-child {
        border-top-right-radius: 0.31255rem;
        border-top-left-radius: 0.31255rem;
      }

      &:last-child {
        border-bottom-right-radius: 0.31255rem;
        border-bottom-left-radius: 0.31255rem;
      }
    }
  }
`;
