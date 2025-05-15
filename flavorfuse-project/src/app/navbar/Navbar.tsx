"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { BiSearch } from "react-icons/bi";
import { FaUser, FaPlus, FaSignOutAlt } from "react-icons/fa";

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
  const pathname = usePathname();
  const { userInitials, userName, userEmail, setUserEmail, setUserInitials, setUserName } = useUserContext();
  const [recipesDropdownOpen, setRecipesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mobileRecipesDropdownOpen, setMobileRecipesDropdownOpen] = useState(false);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLUListElement>(null); // Referenca za hamburger meni

  useEffect(() => {
    const userToken = Cookies.get("auth_token");
    const userEmail = localStorage.getItem("user_email");
    const userName = localStorage.getItem("user_name");
    const userInitials = localStorage.getItem("user_initials");
    if (userToken && userEmail && userName && userInitials && !userEmail) {
      setUserEmail(userEmail);
      setUserName(userName);
      setUserInitials(userInitials);
    }
    setIsLoading(false);
  }, [setUserEmail, setUserName, setUserInitials]);

  // Event listener za klikove izvan hamburger menija
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setMobileRecipesDropdownOpen(false); // Zatvori podmenije ako su otvoreni
        setMobileUserDropdownOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_initials");
    setUserInitials(null);
    setUserName(null);
    setUserEmail(null);
    router.push("/");
  };

  const handleSearchClick = () => {
    router.push("/search");
  };

  return (
    <header className="border-b border-gray-950">
      <nav className="navbar grid grid-cols-[0.5fr,auto,0.5fr] items-center px-4 sm:px-6 lg:px-2 py-1 gap-0">
        <button
          id="hamburger-button"
          onClick={toggleMenu}
          className="lg:hidden focus:outline-none text-gray-800"
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
              <button
                onClick={handleSearchClick}
                className="flex items-center text-gray-700 bg-slate-50 px-6 py-2 rounded-full shadow-lg hover:text-gray-500 transition duration-300"
              >
                <BiSearch className="w-7 h-7 mr-1" />
                <span className="hidden lg:inline">Pretraži</span>
              </button>
            </li>
            {pages.slice(0, 2).map((page, index) =>
              page.title === "RECEPTI" ? (
                <li
                  key={index}
                  className={`relative font-bold cursor-pointer ${pathname === page.path ? "text-[#a49655]" : "text-black hover:text-[#a49655]"}`}
                  onMouseEnter={handleRecipesMouseEnter}
                  onMouseLeave={handleRecipesMouseLeave}
                >
                  <Link href={page.path}>{page.title}</Link>
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
                      className="absolute z-[1001] left-0 top-full bg-white shadow-lg border mt-2 rounded-lg w-56"
                      onMouseEnter={handleRecipesMouseEnter}
                      onMouseLeave={handleRecipesMouseLeave}
                    >
                      {categories.map((item, index) => (
                        <li key={index} className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                          <Link href={item.path} className="block w-full h-full">
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li
                  key={index}
                  className="relative text-black font-bold hover:text-[#a49655] cursor-pointer"
                >
                  <Link href={page.path}>{page.title}</Link>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="flex justify-start lg:justify-center items-center -ml-3 sm:-ml-4">
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
        <div className="flex justify-center">
          <ul className="hidden lg:flex justify-evenly w-full items-center">
            {pages.slice(2).map((page, index) => (
              page.title === "PRIJAVA" ? (
                <li
                  key={index}
                  className={`relative font-bold cursor-pointer ${pathname === page.path ? "text-[#a49655]" : "text-black hover:text-[#a49655]"}`}
                >
                  {isLoading ? (
                    <span>Učitavanje...</span>
                  ) : userEmail ? (
                    <div
                      className="flex items-center ml-4"
                      onMouseEnter={handleUserMouseEnter}
                      onMouseLeave={handleUserMouseLeave}
                    >
                      <p className="mr-2 text-gray-800">Pozdrav, {userName ? userName.split(" ")[0] : ""}</p>
                      <div className="w-8 h-8 bg-[#ffbe46] text-gray-800 font-bold flex items-center justify-center rounded-full shadow-lg">
                        {userInitials}
                      </div>
                      {userDropdownOpen && (
                        <ul
                          className="absolute z-[1001] right-0 top-full bg-white shadow-lg border mt-2 rounded-lg w-56"
                          onMouseEnter={handleUserMouseEnter}
                          onMouseLeave={handleUserMouseLeave}
                        >
                          <div className="flex flex-col items-center p-4">
                            <div className="w-14 h-14 bg-[#ffbe46] text-gray-800 font-bold flex items-center justify-center rounded-full shadow-lg">
                              {userInitials}
                            </div>
                            <span className="mt-2 text-gray-800 font-medium">{userName}</span>
                            <span className="text-gray-600 font-medium">{userEmail}</span>
                          </div>
                          <Link href="/profile">
                            <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                              <FaUser className="w-5 h-5 inline-block mr-2" />
                              Moj profil
                            </li>
                          </Link>
                          <Link href="/add-recipe">
                            <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                              <FaPlus className="w-5 h-5 inline-block mr-2" />
                              Dodaj recept
                            </li>
                          </Link>
                          <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                            <FaSignOutAlt className="w-5 h-5 inline-block mr-2" />
                            Odjava
                          </li>
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link href={page.path}>{page.title}</Link>
                  )}
                </li>
              ) : (
                <li
                  key={index}
                  className={`relative font-bold cursor-pointer ${pathname === page.path ? "text-[#a49655]" : "text-black hover:text-[#a49655]"}`}
                >
                  <Link href={page.path}>{page.title}</Link>
                </li>
              )
            ))}
          </ul>
        </div>
      </nav>
      {menuOpen && (
        <ul ref={menuRef} className="lg:hidden mobile-menu w-full py-3 px-4 space-y-3 mt-14">
          {pages.map((page, index) => (
            <li key={index} className="text-gray-900 font-bold hover:text-[#a49655]">
              {page.title === "RECEPTI" ? (
                <>
                  <div className="flex justify-between items-center" onClick={toggleMobileRecipesDropdown}>
                    <span>{page.title}</span>
                    <svg
                      className={`w-4 h-4 ml-1 transform ${mobileRecipesDropdownOpen ? "rotate-180" : ""}`}
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
                    <ul className="pl-4 mt-2 space-y-2 z-[1002]">
                      {categories.map((category, i) => (
                        <li key={i} className="text-gray-800 hover:text-[#a49655]">
                          <Link href={category.path} onClick={() => setMenuOpen(false)}>
                            {category.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : isLoading ? (
                <span>Učitavanje...</span>
              ) : userEmail && page.title === "PRIJAVA" ? (
                <>
                  <div className="flex justify-between items-center" onClick={toggleMobileUserDropdown}>
                    <span className="text-gray-900 font-bold">{userName}</span>
                    <svg
                      className={`w-4 h-4 ml-1 transform ${mobileUserDropdownOpen ? "rotate-180" : ""}`}
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
                    <ul className="pl-4 mt-2 space-y-2 z-[1002]">
                      <li className="text-gray-800 hover:text-[#a49655]">
                        <Link href="/profile" onClick={() => setMenuOpen(false)}>
                          <FaUser className="w-3 h-3 inline-block mr-2" />
                          Moj profil
                        </Link>
                      </li>
                      <li className="text-gray-800 hover:text-[#a49655]">
                        <Link href="/add-recipe" onClick={() => setMenuOpen(false)}>
                          <FaPlus className="w-3 h-3 inline-block mr-2" />
                          Dodaj recept
                        </Link>
                      </li>
                      <li className="text-gray-800 hover:text-[#a49655] cursor-pointer" onClick={() => { handleLogout(); setMenuOpen(false); }}>
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
              )}
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                handleSearchClick();
                setMenuOpen(false);
              }}
              className="flex items-center text-gray-900 font-medium hover:text-[#a49655] w-full"
            >
              <BiSearch className="w-5 h-5 mr-2" />
              <span>Pretraži</span>
            </button>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Navbar;