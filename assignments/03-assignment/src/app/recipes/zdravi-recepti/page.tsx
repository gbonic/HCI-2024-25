import Link from "next/link";
import '../page.css';

type Page = {
    title: string;
    path: `/${string}`;
};

const categories: Page[] = [
    { title: "Zdravi deserti", path: "/recipes/vrsta-obroka/zdravi-deserti" },
    { title: "Brzi zdravi recepti", path: "/recipes/vrsta-obroka/brzi-zdravi-recepti" },
    { title: "Obroci za mršavljenje", path: "/recipes/vrsta-obroka/obroci-za-mrsavljenje" },
    { title: "Prehrana za sportaše", path: "/recipes/vrsta-obroka/prehrana-za-sportase" },
    { title: "Zdravi napitci", path: "/recipes/vrsta-obroka/zdravi-napitci" },
    { title: "Jačanje imuniteta", path: "/recipes/vrsta-obroka/jacanje-imuniteta" },
];

const ZdraviRecepti = () => {
    return (
        <main className="main-content">
            <div className="left-column">
                <h2>Zdravi recepti</h2>
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

export default ZdraviRecepti;
