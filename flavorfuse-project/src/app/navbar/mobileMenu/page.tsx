import Link from 'next/link';
import { FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

type MobileMenuProps = {
  pages: { title: string; path: string }[];
  categories: { title: string; path: string }[];
  userInitials: string | null;
  userName: string | null;
  menuOpen: boolean;
  mobileRecipesDropdownOpen: boolean;
  mobileUserDropdownOpen: boolean;
  toggleMobileRecipesDropdown: () => void;
  toggleMobileUserDropdown: () => void;
  handleLogout: () => void;
  handleSearchClick: () => void;
  setMenuOpen: (open: boolean) => void;
};

const MobileMenu = ({
  pages,
  categories,
  userInitials,
  userName,
  menuOpen,
  mobileRecipesDropdownOpen,
  mobileUserDropdownOpen,
  toggleMobileRecipesDropdown,
  toggleMobileUserDropdown,
  handleLogout,
  handleSearchClick,
  setMenuOpen,
}: MobileMenuProps) => {
  if (!menuOpen) return null;

  return (
    <ul className="lg:hidden bg-white w-full py-3 px-4 space-y-3">
      {pages.map((page, index) => (
        <li key={index} className="text-gray-900 font-bold hover:text-[#2E6431]">
          {page.title === "RECEPTI" ? (
            <>
              <div className="flex justify-between items-center" onClick={toggleMobileRecipesDropdown}>
                <span>{page.title}</span>
                <svg
                  className={`w-4 h-4 ml-1 transform ${mobileRecipesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {mobileRecipesDropdownOpen && (
                <ul className="pl-4 mt-2 space-y-2">
                  {categories.map((category, i) => (
                    <li key={i} className="text-gray-800 hover:text-[#2E6431]">
                      <Link href={category.path} onClick={() => setMenuOpen(false)}>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            userInitials && page.title === "PRIJAVA" ? (
              <>
                <div className="flex justify-between items-center" onClick={toggleMobileUserDropdown}>
                  <span className="text-gray-900 font-bold">{userName}</span>
                  <svg
                    className={`w-4 h-4 ml-1 transform ${mobileUserDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {mobileUserDropdownOpen && (
                  <ul className="pl-4 mt-2 space-y-2">
                    <li className="text-gray-800 hover:text-[#2E6431]">
                      <Link href="/profile" onClick={() => setMenuOpen(false)}>
                        <FaUser className="w-3 h-3 inline-block mr-2" />
                        Moj profil
                      </Link>
                    </li>
                    <li className="text-gray-800 hover:text-[#2E6431]">
                      <Link href="/add-recipe" onClick={() => setMenuOpen(false)}>
                        <FaPlus className="w-3 h-3 inline-block mr-2" />
                        Dodaj recept
                      </Link>
                    </li>
                    <li className="text-gray-800 hover:text-[#2E6431] cursor-pointer" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                      <FaSignOutAlt className="w-3 h-3 inline-block mr-2" />
                      Odjava
                    </li>
                  </ul>
                )}
              </>
            ) : (
              <Link href={page.path} onClick={() => setMenuOpen(false)}>
                {page.title}
              </Link>
            )
          )}
        </li>
      ))}
      <li>
        <button onClick={handleSearchClick} className="hidden lg:block text-gray-700 p-2 rounded-full shadow-lg hover:text-gray-500 transition duration-300">
          <BiSearch className="w-6 h-6" />
        </button>
      </li>
    </ul>
  );
};

export default MobileMenu;