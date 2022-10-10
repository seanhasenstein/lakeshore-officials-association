import React from 'react';
import Link from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
};

const MenuItemLink = React.forwardRef((props: Props, ref: any) => {
  let { href, children, ...rest } = props;

  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});

MenuItemLink.displayName = 'MenuItemLink';

export default MenuItemLink;
