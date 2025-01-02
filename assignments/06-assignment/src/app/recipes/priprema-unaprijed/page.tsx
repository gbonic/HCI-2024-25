import Link from "next/link";
import '../page.css';

type Page = {
    title: string;
    path: `/${string}`;
};

const categories: Page[] = [
    { title: "Za cijeli tjedan", path: "/recipes/priprema-unaprijed/cijeli-tjedan" },
    { title: "Dugi rok trajanja", path: "/recipes/priprema-unaprijed/dugi-rok-trajanja" },
    { title: "Za putovanje", path: "/recipes/priprema-unaprijed/za-putovanje" },
];

const PripremaUnaprijed = () => {
    return (
        <main className="main-content">
            <div className="left-column">
                <h2>Jela za pripremu unaprijed</h2>
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

export default PripremaUnaprijed;

