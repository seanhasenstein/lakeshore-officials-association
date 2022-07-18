import React from 'react';

export default function usePreventYScroll(isOpen: boolean) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'inherit';
    };
  }, [isOpen]);
}
