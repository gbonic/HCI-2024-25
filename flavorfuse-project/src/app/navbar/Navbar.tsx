"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { BiSearch } from "react-icons/bi";
import MobileMenu from "./mobileMenu/page";
import NavItem from "./NavItem/page";
import DropdownMenu from "./dropdown-menu/page";
import UserMenu from "./user-menu/page";

type Page = {
  title: string;
  path: string;
};

const pages: Page[] = [
  { title: "HOME", path: "/" },
  { title: "RECEPTI", path: "#" },
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
  const { userInitials, userName, setUserInitials, setUserName } = useUserContext();
  const [recipesDropdownOpen, setRecipesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mobileRecipesDropdownOpen, setMobileRecipesDropdownOpen] = useState(false);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
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

  const toggleMobileRecipesDropdown = () => {
    setMobileRecipesDropdownOpen(!mobileRecipesDropdownOpen);
  };

  const toggleMobileUserDropdown = () => {
    setMobileUserDropdownOpen(!mobileUserDropdownOpen);
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user_name");
    setUserInitials(null);
    setUserName(null);
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleSearchClick = () => {
    router.push("/search");
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
        <div className="flex items-center">
          <ul className="hidden lg:flex justify-evenly items-center w-full">
            <li>
              <button onClick={handleSearchClick} className="flex items-center text-gray-700 px-6 py-2 rounded-full shadow-lg hover:text-gray-500 transition duration-300">
                <BiSearch className="w-7 h-7 mr-1" />
                <span className="hidden lg:inline">Pretraži</span>
              </button>
            </li>
            {pages.slice(0, 2).map((page, index) =>
              page.title === "RECEPTI" ? (
                <NavItem
                  key={index}
                  title={page.title}
                  path={page.path}
                  onMouseEnter={handleRecipesMouseEnter}
                  onMouseLeave={handleRecipesMouseLeave}
                >
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
                  <DropdownMenu
                    isOpen={recipesDropdownOpen}
                    items={categories}
                    onMouseEnter={handleRecipesMouseEnter}
                    onMouseLeave={handleRecipesMouseLeave}
                  />
                </NavItem>
              ) : (
                <NavItem key={index} title={page.title} path={page.path} />
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
        <div className="flex justify-center">
          <ul className="hidden lg:flex justify-evenly w-full items-center">
            {pages.slice(2).map((page, index) => (
              page.title === "PRIJAVA" ? (
                userInitials ? (
                  <UserMenu
                    key={index}
                    userInitials={userInitials}
                    userName={userName}
                    userDropdownOpen={userDropdownOpen}
                    handleUserMouseEnter={handleUserMouseEnter}
                    handleUserMouseLeave={handleUserMouseLeave}
                    handleLogout={handleLogout}
                  />
                ) : (
                  <NavItem key={index} title={page.title} path={page.path} />
                )
              ) : (
                <NavItem key={index} title={page.title} path={page.path} />
              )
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <MobileMenu
        pages={pages}
        categories={categories}
        userInitials={userInitials}
        userName={userName}
        menuOpen={menuOpen}
        mobileRecipesDropdownOpen={mobileRecipesDropdownOpen}
        mobileUserDropdownOpen={mobileUserDropdownOpen}
        toggleMobileRecipesDropdown={toggleMobileRecipesDropdown}
        toggleMobileUserDropdown={toggleMobileUserDropdown}
        handleLogout={handleLogout}
        handleSearchClick={handleSearchClick}
        setMenuOpen={setMenuOpen}
      />
    </header>
  );
};

export default Navbar;