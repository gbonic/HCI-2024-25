import Link from "next/link";
import '../page.css';

type Page = {
    title: string;
    path: `/${string}`;
};

const categories: Page[] = [
    { title: "Blagdanska jela", path: "/recipes/tradicionalna-jela/blagdanska-jela" },
    { title: "Sezonska jela", path: "/recipes/tradicionalna-jela/sezonska-jela" },
    { title: "Zimnica", path: "/recipes/tradicionalna-jela/zimnica" },
];

const TradicionalnaJela = () => {
    return (
        <main className="main-content">
            <div className="left-column">
                <h2>Tradicionalna jela</h2>
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

export default TradicionalnaJela;

