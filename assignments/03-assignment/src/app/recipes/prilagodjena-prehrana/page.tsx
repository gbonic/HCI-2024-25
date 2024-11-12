import Link from "next/link";
import '../page.css';

type Page = {
    title: string;
    path: `/${string}`;
};

const categories: Page[] = [
    { title: "Vegansko", path: "/recipes/prilagodjena-prehrana/vegansko" },
    { title: "Vegetarijansko", path: "/recipes/prilagodjena-prehrana/vegetarijansko" },
    { title: "Bez glutena", path: "/recipes/prilagodjena-prehrana/bez-glutena" },
    { title: "Bez laktoze", path: "/recipes/prilagodjena-prehrana/bez-laktoze" },
    { title: "Keto prehrana", path: "/recipes/prilagodjena-prehrana/keto-prehrana" },
];

const PrilagodjenaPrehrana = () => {
    return (
        <main className="main-content">
            <div className="left-column">
                <h2>Prilagođena prehrana</h2>
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

export default PrilagodjenaPrehrana;
