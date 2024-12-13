import Link from "next/link";
import './navbar.css';

type Page = {
  title: string;
  path: `/${string}`;
};


const pages: Page[] = [
  { title: "HOME", path: "/" },
  { title: "RECIPES", path: "/recipes" },
  { title: "BLOG", path: "/blog" },
  { title: "KONTAKT", path: "/kontakt" },
];

function processPage(page: Page, index: number) {
  return (
      <Link href={page.path}>{page.title}</Link>
  );
}

const Navbar = () => {
  return (
    <header className="header">
      <ul className="page">
        {pages.map((page, index) => {
          if (page.title === "RECIPES") {
            return (
                <li key={index} className="flavor-fuse">
                  {processPage(page, index)}
                  <h1>FlavorFuse</h1>
                </li>
            );
          }
          return processPage(page, index);
        })}
      </ul>
    </header>
  );
};

export default Navbar;
