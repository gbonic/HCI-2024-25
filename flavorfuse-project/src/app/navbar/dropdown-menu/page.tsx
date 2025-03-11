import Link from 'next/link';

type DropdownMenuProps = {
  isOpen: boolean;
  items: { title: string; path: string }[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const DropdownMenu = ({ isOpen, items, onMouseEnter, onMouseLeave }: DropdownMenuProps) => {
  if (!isOpen) return null;

  return (
    <ul
      className="absolute z-50 left-0 top-full bg-white shadow-lg border mt-2 rounded-lg w-56"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item, index) => (
        <li key={index} className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
          <Link href={item.path} className="block w-full h-full">
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;