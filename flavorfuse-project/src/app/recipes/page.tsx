"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

type Page = {
    title: string;
    path: `/${string}`;
    image?: string;
};

const categories: Page[] = [
    { title: "Prema vrsti obroka", path: "/recipes/vrsta-obroka", image: "/images/avokado.png" },
    { title: "Zdravi recepti", path: "/recipes/zdravi-recepti", image: "/images/cvijet.png" },
    { title: "Brzo i jednostavno", path: "/recipes/brzo-i-jednostavno", image: "/images/list.png" },
    { title: "Tradicionalna jela", path: "/recipes/tradicionalna-jela", image: "/images/meso.png" },
    { title: "Prilagođena prehrana", path: "/recipes/prilagodjena-prehrana", image: "/images/naranca.png" },
    { title: "Jela za pripremu unaprijed", path: "/recipes/priprema-unaprijed", image: "/images/prilog.png" },
    { title: "Deserti", path: "/recipes/deserti", image: "/images/slika.jpg" },
];

export default function Recipes() {
    const pathname = usePathname(); // Dohvaćamo trenutnu putanju
    const isRecipesPage = pathname === '/recipes';

    return (
        <main
            className={`flex flex-col items-center justify-center ${isRecipesPage ? 'min-h-screen' : ''
                } mb-16`}
        >
            {/* Kategorije za desktop verziju */}
            <section className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 px-4 w-full justify-items-center">
                {categories.map((category, index) => (
                    <Link key={index} href={category.path} className="group text-center">
                        <div className="relative flex flex-col items-center justify-center w-36 h-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                            <div className="relative w-full h-36">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-lg transition-transform duration-500 transform group-hover:translate-y-[-10px]"
                                />
                            </div>
                            <div className="flex items-center justify-center w-full h-12 bg-white">
                                <span className="text-gray-800 font-semibold">{category.title}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>

            {/* Horizontalno pomicanje za mobilne uređaje */}
            <section className="overflow-x-scroll no-scrollbar lg:hidden px-2 mt-2">
                <div className="inline-flex gap-2">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={category.path}
                            className="group text-center w-2/5"
                        >
                            <div className="relative flex flex-col items-center justify-center w-36 h-36 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                <div className="relative w-24 h-24">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-lg transition-transform duration-500 transform group-hover:translate-y-[-10px]"
                                    />
                                </div>
                                <div className="flex items-center justify-center w-full h-12 bg-white">
                                    <span className="text-gray-800 font-semibold">{category.title}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}