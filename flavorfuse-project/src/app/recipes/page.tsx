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
    { title: "Prema vrsti obroka", path: "/recipes/vrsta-obroka", image: "/images/prema-vrsti-obroka.png" },
    { title: "Zdravi recepti", path: "/recipes/zdravi-recepti", image: "/images/zdravi-recepti.png" },
    { title: "Brzo i jednostavno", path: "/recipes/brzo-i-jednostavno", image: "/images/brzo-i-jednostavno.png" },
    { title: "Tradicionalna jela", path: "/recipes/tradicionalna-jela", image: "/images/tradicionalna-jela.png" },
    { title: "Prilagođena prehrana", path: "/recipes/prilagodjena-prehrana", image: "/images/prilagodena-prehrana.png" },
    { title: "Jela za pripremu unaprijed", path: "/recipes/priprema-unaprijed", image: "/images/priprema-unaprijed.png" },
    { title: "Deserti", path: "/recipes/deserti", image: "/images/deserti.png" },
];

export default function Recipes() {
    const pathname = usePathname();
    const isRecipesPage = pathname === '/recipes';

    return (
        <main className={`flex flex-col items-center justify-center ${isRecipesPage ? 'min-h-screen' : ''} mb-6`}>
            {/* 🖥️ Desktop version - 7 columns */}
            <section className="hidden lg:grid grid-cols-7 gap-4 px-4 w-full max-w-6xl mx-auto">
                {categories.map((category, index) => (
                    <Link key={index} href={category.path} className="group text-center">
                        <div className="relative flex flex-col items-center justify-center w-full h-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
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
                                <span className="text-gray-800 font-semibold text-sm px-2">{category.title}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>

            <section className="lg:hidden w-full max-w-[90vw] overflow-hidden px-4">
                <div className="flex justify-start items-center overflow-x-auto gap-2 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pl-4">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={category.path}
                            className="group flex-shrink-0 w-[30vw] max-w-xs snap-start"
                        >
                            <div className="flex flex-col items-center justify-center w-28 h-36 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                <div className="relative w-20 h-20">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-lg transition-transform duration-500 transform group-hover:translate-y-[-10px]"
                                    />
                                </div>
                                <div className="flex items-center justify-center w-full h-12 bg-white">
                                    <span className="text-gray-800 font-semibold text-sm px-2 text-center break-words">{category.title}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}