import Link from "next/link";
import '../page.css';

type Page = {
    title: string;
    path: `/${string}`;
};

const categories: Page[] = [
    { title: "Doručak", path: "/recipes/vrsta-obroka/dorucak" },
    { title: "Ručak", path: "/recipes/vrsta-obroka/rucak" },
    { title: "Večera", path: "/recipes/vrsta-obroka/vecera" },
];

const VrstaObroka = () => {
    return (
        <main className="main-content">
            <div className="left-column">
                <h2>Prema vrsti obroka</h2>
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

export default VrstaObroka;

