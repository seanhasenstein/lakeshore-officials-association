import React from 'react';
import useOutsideClick from './useOutsideClick';
import useEscapeKeydownClose from './useEscapeKeydownClose';

export default function useMenu(ref: React.RefObject<HTMLDivElement>) {
  const [isOpen, setIsOpen] = React.useState(false);
  useOutsideClick(isOpen, setIsOpen, ref);
  useEscapeKeydownClose(isOpen, setIsOpen);

  const handleMenuButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    setIsOpen,
    handleMenuButtonClick,
  };
}
