import Link from 'next/link';

type NavItemProps = {
  title: string;
  path: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children?: React.ReactNode;
};

const NavItem = ({ title, path, onMouseEnter, onMouseLeave, children }: NavItemProps) => {
  return (
    <li
      className="relative text-black font-bold hover:text-[#2E6431] cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link href={path}>{title}</Link>
      {children}
    </li>
  );
};

export default NavItem;