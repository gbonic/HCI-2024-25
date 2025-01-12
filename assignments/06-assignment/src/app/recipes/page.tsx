"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    const pathname = usePathname(); // Dohvaćamo trenutnu putanju
    const isRecipesPage = pathname === '/recipes';

    return (
        <main
            className={`flex flex-col items-center justify-center ${isRecipesPage ? 'min-h-screen' : ''
                } mb-16`}
        >
            {/* Kategorije */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 px-4">

                {categories.map((category, index) => (
                    <Link
                        key={index}
                        href={category.path}
                        className="group text-center"
                    >
                        <div
                            className="relative flex justify-center items-center w-36 h-36 bg-[#fde4b5] text-[#b2823b] font-italianno border-2 border-[#b2823b] rounded-full shadow-lg hover:translate-y-[-10px] transition-transform duration-500"
                        >
                            {category.title}
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
}
