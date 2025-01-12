"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "HOME", path: "/" },
  { title: "RECEPTI", path: "/recipes" },
  { title: "BLOG", path: "/blog" },
  { title: "KONTAKT", path: "/kontakt" },
  { title: "PRIJAVA", path: "/prijava" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="border-b border-gray-950">
      <nav className="grid grid-cols-[1fr,auto,1fr] items-center px-4 sm:px-6 lg:px-8 py-2 gap-0">
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
            {pages.slice(0, 3).map((page, index) => (
              <li key={index} className="text-black font-bold hover:text-[#2E6431]">
                <Link href={page.path}>{page.title}</Link>
              </li>
            ))}
          </ul>
          
        </div>

        {/* Središnji logo */}
        <div className="flex justify-start lg:justify-center items-center ml-[-30px]">
          <Link href="/">
            <Image
              src="/images/FlavorFuse-dark-logo.png"
              alt="FlavorFuse"
              width={70}
              height={50}
              className="m-0 p-0"
            />
          </Link>
        </div>

        {/* Desna strana */}
        <div className="flex justify-center">
          <ul className="hidden lg:flex justify-around w-full items-center">
            {pages.slice(3).map((page, index) => (
              <li key={index} className="text-black font-bold hover:text-[#2E6431]">
                <Link href={page.path}>{page.title}</Link>
              </li>
            ))}
          </ul>
          <input
            type="text"
            className="hidden lg:block border rounded-full px-2 py-1 text-black focus:outline-none"
            placeholder="Pretraži..."
          />
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <ul className="md:hidden bg-white w-full py-3 px-4 space-y-3">
          {pages.map((page, index) => (
            <li key={index} className="text-black font-bold hover:text-[#2E6431]">
              <Link href={page.path} onClick={() => setMenuOpen(false)}>
                {page.title}
              </Link>
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
