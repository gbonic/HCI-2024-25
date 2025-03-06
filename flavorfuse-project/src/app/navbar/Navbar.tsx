"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { FaUser, FaPlus, FaSignOutAlt } from "react-icons/fa";

type Page = {
  title: string;
  path: string;
};

const pages: Page[] = [
  { title: "HOME", path: "/" },
  { title: "RECEPTI", path: "#" }, // Updated path to "#" since the page no longer exists
  { title: "BLOG", path: "/blog" },
  { title: "KONTAKT", path: "/kontakt" },
  { title: "PRIJAVA", path: "/prijava" },
];

const categories: Page[] = [
  { title: "Prema vrsti obroka", path: "/recipes/vrsta-obroka" },
  { title: "Zdravi recepti", path: "/recipes/zdravi-recepti" },
  { title: "Brzo i jednostavno", path: "/recipes/brzo-i-jednostavno" },
  { title: "Tradicionalna jela", path: "/recipes/tradicionalna-jela" },
  { title: "Prilagođena prehrana", path: "/recipes/prilagodjena-prehrana" },
  { title: "Jela za pripremu unaprijed", path: "/recipes/priprema-unaprijed" },
  { title: "Deserti", path: "/recipes/deserti" },
];

const Navbar = () => {
  const router = useRouter();
  const { userInitials, userName, setUserInitials, setUserName } = useUserContext();  // Dohvati inicijale iz UserContext
  const [recipesDropdownOpen, setRecipesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleRecipesMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setRecipesDropdownOpen(true);
  };

  const handleRecipesMouseLeave = () => {
    const timeout = setTimeout(() => {
      setRecipesDropdownOpen(false);
    }, 500);
    setDropdownTimeout(timeout);
  };

  const handleUserMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setUserDropdownOpen(true);
  };

  const handleUserMouseLeave = () => {
    const timeout = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 500);
    setDropdownTimeout(timeout);
  };

  const toggleMobileDropdown = () => {
    setMobileDropdownOpen(!mobileDropdownOpen);
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user_name");
    setUserInitials(null);
    setUserName(null);
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="border-b border-gray-950">
      <nav className="relative grid grid-cols-[0.5fr,auto,0.5fr] items-center px-4 sm:px-6 lg:px-2 py-1 gap-0">
        {/* Lijeva strana */}
        <button
          onClick={toggleMenu}
          className="lg:hidden focus:outline-none text-gray-800 "
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex justify-center">
          <ul className="hidden lg:flex justify-around w-full items-center">
            {pages.slice(0, 3).map((page, index) =>
              page.title === "RECEPTI" ? (
                <li
                  key={index}
                  className="relative text-black font-bold hover:text-[#2E6431] cursor-pointer"
                  onMouseEnter={handleRecipesMouseEnter}
                  onMouseLeave={handleRecipesMouseLeave}
                >
                  {page.title}
                  <svg
                    className="w-4 h-4 inline-block ml-1"
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
                  {recipesDropdownOpen && (
                    <ul
                      className="absolute z-50 left-0 top-full bg-white shadow-lg border mt-2 rounded-lg w-56"
                      onMouseEnter={handleRecipesMouseEnter}
                      onMouseLeave={handleRecipesMouseLeave}
                    >
                      {categories.map((category, i) => (
                        <li key={i} className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                          <Link href={category.path} className="block w-full h-full">
                            {category.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li
                  key={index}
                  className="text-black font-bold hover:text-[#2E6431]"
                >
                  <Link href={page.path}>{page.title}</Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Središnji logo */}
        <div className="flex justify-start lg:justify-center items-center">
          <Link href="/">
            <Image
              src="/images/FlavorFuse-dark-logo.png"
              alt="FlavorFuse"
              width={60}
              height={50}
              className="mt-2 p-0"
            />
          </Link>
        </div>

        {/* Desna strana */}
        <div className="flex justify-center items-center">
          <ul className="hidden lg:flex justify-around w-full items-center">
            {pages.slice(3).map((page, index) => (
              page.title === "PRIJAVA" ? (
                userInitials ? (
                  <div
                    key={index}
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
                ) : (
                  <li key={index} className="text-black font-bold hover:text-[#2E6431]">
                    <Link href={page.path}>{page.title}</Link>
                  </li>
                )
              ) : (
                <li key={index} className="text-black font-bold hover:text-[#2E6431]">
                  <Link href={page.path}>{page.title}</Link>
                </li>
              )
            ))}
          </ul>
          <input
            type="text"
            className="hidden lg:block border-2 border-[#feebd0] rounded-full px-2 py-1 text-black focus:outline-none"
            placeholder="Pretraži..."
          />
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <ul className="lg:hidden bg-white w-full py-3 px-4 space-y-3">
          {pages.map((page, index) => (
            <li key={index} className="text-black font-bold hover:text-[#2E6431]">
              {page.title === "RECEPTI" ? (
                <>
                  <div className="flex justify-between items-center" onClick={toggleMobileDropdown}>
                    <span>{page.title}</span>
                    <svg
                      className={`w-4 h-4 ml-1 transform ${mobileDropdownOpen ? 'rotate-180' : ''}`}
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
                  {mobileDropdownOpen && (
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
                <Link href={page.path} onClick={() => setMenuOpen(false)}>
                  {page.title}
                </Link>
              )}
            </li>
          ))}
          <li>
            <input
              type="text"
              className="border rounded-full px-2 py-1 text-black focus:outline-none w-full"
              placeholder="Pretraži..."
            />
          </li>
        </ul>
      )}
    </header>
  );
};

export default Navbar;