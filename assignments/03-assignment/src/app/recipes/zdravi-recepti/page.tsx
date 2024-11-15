import Link from "next/link";
import '../page.css';

type Page = {
    title: string;
    path: `/${string}`;
};

const categories: Page[] = [
    { title: "Zdravi deserti", path: "/recipes/zdravi-recepti/zdravi-deserti" },
    { title: "Brzi zdravi recepti", path: "/recipes/zdravi-recepti/brzi-zdravi-recepti" },
    { title: "Obroci za mršavljenje", path: "/recipes/zdravi-recepti/obroci-za-mrsavljenje" },
    { title: "Prehrana za sportaše", path: "/recipes/zdravi-recepti/prehrana-za-sportase" },
    { title: "Zdravi napitci", path: "/recipes/zdravi-recepti/zdravi-napitci" },
    { title: "Jačanje imuniteta", path: "/recipes/zdravi-recepti/jacanje-imuniteta" },
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
