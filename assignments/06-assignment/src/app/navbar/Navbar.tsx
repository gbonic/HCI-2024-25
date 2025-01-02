import Link from "next/link";

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
      className={`text-black font-bold text-base hover:text-[#2f4f2f] ${
        page.title === "FlavorFuse"
          ? "font-italianno text-[#2f4f2f] text-5xl font-light"
          : ""
      }`}
    >
      {page.title}
    </Link>
  );
}

const Navbar = () => {
  return (
    <header className="py-6">
      <ul className="flex items-center justify-between w-full list-none p-0 m-0 px-4">
        {/* Linkovi ravnomerno raspoređeni */}
        {pages.map((page, index) => (
          <li
            key={index}
            className="flex items-center justify-around flex-1 text-center"
          >
            {processPage(page, index)}
          </li>
        ))}
        {/* Search input sa razmakom */}
        <input
          type="text"
          className="border rounded px-2 py-2 text-black focus:outline-none"
          placeholder="Pretraži..."
        />
      </ul>
    </header>
  );
};

export default Navbar;
