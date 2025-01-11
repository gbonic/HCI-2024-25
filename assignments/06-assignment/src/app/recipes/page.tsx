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

    // Provjeravamo da li smo na /recipes stranici
    const isRecipesPage = pathname === '/recipes';
    
   

    return (
        <main className={`flex flex-col items-center justify-center ${isRecipesPage ? 'min-h-screen' : ''} mb-16`}>
            <section className="flex flex-wrap justify-center items-center gap-8">
                {categories.map((category, index) => (
                    <Link
                        key={index}
                        href={category.path}
                        className="text-center text-lg font-bold tracking-wide group-hover:scale-105 transition-transform duration-300"
                    >
                        <div
                            className="relative group flex justify-center items-center w-44 h-44 bg-[#fde4b5] text-[#b2823b] font-italianno border-2 border-[#b2823b] rounded-full shadow-lg hover:translate-y-[-10px] transition-transform duration-500"
                        >
                            {category.title}
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
}