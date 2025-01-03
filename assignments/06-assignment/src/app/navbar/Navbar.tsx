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
          ? "font-italianno text-[#2f4f2f]  font-light text-4xl"
          : ""
      }`}
    >
      {page.title}
    </Link>
  );
}

const Navbar = () => {
  return (
    <header className="py-6 mx-10">
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
          className="border rounded px-1 py-1 text-black focus:outline-none"
          placeholder="Pretraži..."
        />
      </ul>
    </header>
  );
};

export default Navbar;
