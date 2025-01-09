import Link from 'next/link';

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
        <main className="grid grid-rows-[1fr_auto_1fr] min-h-screen">
            <section className="flex flex-wrap justify-center items-center gap-8">
                {popularRecipes.map((recipe, index) => (
                    <div
                        key={index}
                        className="relative w-72 h-40 rounded-lg overflow-hidden shadow-md"
                    >
                        {/* Slika recepta */}
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Tekst preko slike */}
                        <div className="absolute inset-0 flex justify-center items-center text-center backdrop-blur-[3px] bg-black/20">
                            <div className="bg-black/30 px-4 py-2 w-72">
                                <Link
                                    href={recipe.path}
                                    className="text-center text-xl font-bold drop-shadow-md text-[#fde4b5] uppercase"
                                >
                                    {recipe.title}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}
