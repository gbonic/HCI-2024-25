import Link from "next/link";
import '../page.css';

type Page = {
    title: string;
    path: `/${string}`;
};

const categories: Page[] = [
    { title: "Recepti za početnike", path: "/recipes/brzo-i-jednostavno/recepti-za-početnike" },
    { title: "Jela za 30 minuta", path: "/recipes/brzo-i-jednostavno/jela-za-30-minuta" },
    { title: "Međuobroci", path: "/recipes/brzo-i-jednostavno/meduobroci" },
    { title: "Kuhana jela", path: "/recipes/brzo-i-jednostavno/kuhana-jela" },
    { title: "Ukusno i jeftino", path: "/recipes/brzo-i-jednostavno/ukusno-i-jeftino" },
];

const BrzoJednostavno = () => {
    return (
        <main className="main-content">
            <div className="left-column">
                <h2>Brzo i jednostavno</h2>
                <section className="categories">
                    {categories.map((category, index) => (
                        <div key={index} className="category">
                            <Link href={category.path}>
                                {category.title}
                            </Link>
                        </div>
                    ))}
                </section>
            </div>
            <div className="search-bar-container">
                <input type="text" placeholder="Search..." className="search-bar" />
            </div>
        </main>
    );
};

export default BrzoJednostavno;
