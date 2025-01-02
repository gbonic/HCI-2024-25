import './page.css';
import Link from 'next/link';

type Page = {
    title: string;
    path: `/${string}`;
};

const categories: Page[] = [
    { title: "Prema vrsti obroka", path: "/recipes/vrsta-obroka" },
    { title: "Zdravi recepti", path: "/recipes/zdravi-recepti" },
    { title: "Brzo i jednostavno", path: "/recipes/brzo-i-jednostavno" },
    { title: "Tradicionalna jela", path: "/recipes/tradicionalna-jela" },
    { title: "Prilagođena prehrana", path: "/recipes/prilagodjena-prehrana" },
    { title: "Jela za pripremu unaprijed", path: "/recipes/priprema-unaprijed" },
    { title: "Deserti", path: "/recipes/deserti" },
];

export default function Recipes() {
    return (
        <main className="main-content-recipes">
            <section className="categories-recipes">
                {categories.map((category, index) => (
                    <div key={index} className="category-recipes">
                    <Link href={category.path}>
                            {category.title}
                    </Link>
                </div>
                ))}
            </section>
        </main>
    );
}


