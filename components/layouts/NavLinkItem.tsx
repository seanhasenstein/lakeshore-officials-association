import Link from 'next/link';

type Props = {
  label: string;
  href: string;
  isActive: boolean;
};

export default function NavLinkItem(props: Props) {
  return (
    <li className={props.isActive ? 'active' : ''}>
      <Link href={props.href}>
        <a>{props.label}</a>
      </Link>
    </li>
  );
}
