import Link from "next/link";
import '../page.css';

type Page = {
    title: string;
    path: `/${string}`;
};

const categories: Page[] = [
    { title: "Torte", path: "/recipes/deserti/torte" },
    { title: "Kolači", path: "/recipes/deserti/kolaci" },
    { title: "Deserti bez pečenja", path: "/recipes/deserti/deserti-bez-pecenja" },
    { title: "Deserti do 5 sastojaka", path: "/recipes/deserti/deserti-do-5-sastojaka" },
    { title: "Deserti u čaši", path: "/recipes/deserti/deserti-u-casi" },
];

const Deserti = () => {
    return (
        <main className="main-content">
            <div className="left-column">
                <h2>Deserti</h2>
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

export default Deserti;
