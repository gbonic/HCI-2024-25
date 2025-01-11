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
  { title: "FlavorFuse", path: "/" },
  { title: "KONTAKT", path: "/kontakt" },
  { title: "PRIJAVA", path: "/prijava" },
];

function processPage(page: Page, index: number) {
  return (
    <Link
      href={page.path}
      key={index}
      className={`text-black font-bold text-base hover:text-[#2E6431] hover:scale-105 transition-transform duration-300 ${
        page.title === "FlavorFuse" ? "" : ""
      }`}
    >
      {page.title === "FlavorFuse" ? (
        <Image
          src="/images/FlavorFuse-dark-logo.png" 
          alt="FlavorFuse"
          className="h-14 w-auto"
        />
      ) : (
        page.title
      )}
    </Link>
  );
}

const Navbar = () => {
  return (
    <header className="pt-3 border-b border-gray-950 [grid-area:header]">
      <ul className="flex items-center justify-between w-full list-none p-0 m-0 px-4">
        {pages.map((page, index) => (
          <li
            key={index}
            className="flex items-center justify-around flex-1 text-center"
          >
            {processPage(page, index)}
          </li>
        ))}
        <input
          type="text"
          className="border rounded-full px-1 py-1 text-black focus:outline-none"
          placeholder="  Pretraži..."
        />
      </ul>
    </header>
  );
};

export default Navbar;
