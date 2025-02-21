import Link from 'next/link';
import Image from 'next/image';

type Page = {
    title: string;
    path: `/${string}`;
    image: string; // Dodaj svojstvo za sliku
};

const popularRecipes: Page[] = [
    { title: "Salata s piletinom", path: "/", image: "/images/salata-piletina.jpg" },
    { title: "Torta od čokolade", path: "/", image: "/images/cokoladna-torta.jpg" },
    { title: "Lazanje", path: "/", image: "/images/lazanje.jpg" },
    { title: "Margherita", path: "/", image: "/images/pizza-margherita.jpg" },
];

export default function PopularRecipes() {
    return (
        <main>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                {popularRecipes.map((recipe, index) => (
                    <Link
                        key={index}
                        href={recipe.path}
                        className="text-center text-xl font-bold drop-shadow-md text-[#fde4b5] uppercase"
                    >
                        <div
                            key={index}
                            className="relative w-full h-44 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
                        >
                            {/* Slika recepta */}
                            <Image
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                                width={500}
                                height={300}
                            />
                            {/* Tekst preko slike */}
                            <div className="absolute inset-0 flex justify-center items-center text-center backdrop-blur-[3px] bg-black/20">
                                <div className="bg-black/30 px-4 py-2 w-72">
                                    {recipe.title}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
}
