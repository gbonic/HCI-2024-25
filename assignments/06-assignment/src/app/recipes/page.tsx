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
        <main className="grid grid-rows-[1fr_auto_1fr] min-h-screen">
            <section className="flex flex-wrap justify-center items-center gap-8 mt-10">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex justify-center items-center p-5 m-12"
                    >
                        <Link href={category.path} className="px-5 py-3 text-lg bg-[#fde4b5] text-gray-900 border-2 border-[#b2823b] rounded-full hover:scale-105 transition-transform duration-300">
                            {category.title}
                        </Link>
                    </div>
                ))}
            </section>
        </main>
    );
}
