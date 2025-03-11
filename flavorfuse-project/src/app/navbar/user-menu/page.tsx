import Link from 'next/link';
import { FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa';

type UserMenuProps = {
  userInitials: string | null;
  userName: string | null;
  userDropdownOpen: boolean;
  handleUserMouseEnter: () => void;
  handleUserMouseLeave: () => void;
  handleLogout: () => void;
};

const UserMenu = ({
  userInitials,
  userName,
  userDropdownOpen,
  handleUserMouseEnter,
  handleUserMouseLeave,
  handleLogout,
}: UserMenuProps) => {
  if (!userInitials) return null;

  return (
    <div
      className="relative flex items-center ml-4 cursor-pointer"
      onMouseEnter={handleUserMouseEnter}
      onMouseLeave={handleUserMouseLeave}
    >
      <div className="w-10 h-10 bg-[#fde4b5] text-gray-800 font-bold flex items-center justify-center rounded-full shadow-lg">
        {userInitials}
      </div>
      {userDropdownOpen && (
        <ul
          className="absolute z-50 right-0 top-full bg-white shadow-lg border mt-2 rounded-lg w-56"
          onMouseEnter={handleUserMouseEnter}
          onMouseLeave={handleUserMouseLeave}
        >
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-[#fde4b5] text-gray-800 font-bold flex items-center justify-center rounded-full shadow-lg">
              {userInitials}
            </div>
            <span className="mt-2 text-gray-800 font-bold">{userName}</span>
            <span className="text-gray-600">{localStorage.getItem("email")}</span>
          </div>
          <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
            <Link href="/profile">
              <FaUser className="w-5 h-5 inline-block mr-2" />
              Moj profil
            </Link>
          </li>
          <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
            <Link href="/add-recipe">
              <FaPlus className="w-5 h-5 inline-block mr-2" />
              Dodaj recept
            </Link>
          </li>
          <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
            <FaSignOutAlt className="w-5 h-5 inline-block mr-2" />
            Odjava
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;