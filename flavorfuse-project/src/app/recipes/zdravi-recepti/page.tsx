"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { createClient, Entry, Asset } from 'contentful';

const client = createClient({
  space: 'ocm9154cjmz1',
  accessToken: 'r7B6-Fb1TqITT79XXiA3igrdqBEtOwlHiS2hazq2T6o'
});

type Recept = {
  contentTypeId: string;
  sys: {
    id: string;
  };
  fields: {
    nazivRecepta: string;
    sastojci: string;
    uputeZaPripremu: string;
    opisRecepta?: string;
    kategorija?: string[];
    podkategorija?: string[];
    slikaRecepta?: Asset | string;
  };
};

const mapEntryToRecept = (entry: Entry<Recept>): Recept => {
  const nazivRecepta = typeof entry.fields.nazivRecepta === 'string' ? entry.fields.nazivRecepta : 'Nepoznato ime';
  const sastojci = typeof entry.fields.sastojci === 'string' ? entry.fields.sastojci : 'Nepoznati sastojci';
  const uputeZaPripremu = typeof entry.fields.uputeZaPripremu === 'string' ? entry.fields.uputeZaPripremu : 'Nema uputa';
  const opisRecepta = typeof entry.fields.opisRecepta === 'string' ? entry.fields.opisRecepta : '';
  const kategorija = Array.isArray(entry.fields.kategorija)
    ? entry.fields.kategorija.map((kat) => (typeof kat === 'string' ? kat : kat.fields.nazivKategorije))
    : [];

  const podkategorija = Array.isArray(entry.fields.podkategorija)
    ? entry.fields.podkategorija.map((kat) => (typeof kat === 'string' ? kat : kat.fields.nazivPodkategorije))
    : [];

  const slikaRecepta = entry.fields.slikaRecepta && entry.fields.slikaRecepta.sys && entry.fields.slikaRecepta.fields
    ? {
      sys: entry.fields.slikaRecepta.sys,
      fields: entry.fields.slikaRecepta.fields,
      metadata: entry.fields.slikaRecepta.metadata,
    }
    : undefined;

  return {
    contentTypeId: entry.sys.contentType.sys.id,
    sys: {
      id: entry.sys.id,
    },
    fields: {
      nazivRecepta,
      sastojci,
      uputeZaPripremu,
      opisRecepta,
      kategorija,
      podkategorija,
      slikaRecepta,
    },
  };
};

const fetchRecipes = async (): Promise<Recept[]> => {
  const response = await client.getEntries({ content_type: 'recept' });
  return response.items.map(mapEntryToRecept);
};


const ZdraviReceptiPage = () => {
  const [recipes, setRecipes] = useState<Recept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recept | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const selectedSubcategory = searchParams.get('subcategory') || '';

  useEffect(() => {
    setLoading(true);

    const fetchAllRecipes = async () => {
      try {
        const contentfulRecipes = await fetchRecipes();

        const filteredContentfulRecipes = contentfulRecipes.filter((item) => {
          return Array.isArray(item.fields.kategorija) && item.fields.kategorija.some((kat) => kat === 'Zdravi recepti') &&
            (!selectedSubcategory || (Array.isArray(item.fields.podkategorija) && item.fields.podkategorija.includes(selectedSubcategory)));
        });

        const localStorageRecipes = localStorage.getItem('recipes');
        let combinedRecipes = filteredContentfulRecipes;

        if (localStorageRecipes) {
          try {
            const parsedRecipes = JSON.parse(localStorageRecipes);

            const formattedRecipes = parsedRecipes.map((recipe: any) => ({
              contentTypeId: 'recept',
              sys: { id: recipe.id.toString() },
              fields: {
                nazivRecepta: recipe.title || 'Nepoznato ime',
                sastojci: recipe.ingredients || 'Nema sastojaka',
                uputeZaPripremu: recipe.steps || 'Nema uputa',
                opisRecepta: recipe.description || '',
                kategorija: [recipe.category || ''],
                podkategorija: [recipe.subCategory || ''],
                slikaRecepta: recipe.image || undefined,
                userEmail: recipe.userEmail,
              },
            }));

            const filteredLocalStorageRecipes = formattedRecipes.filter((recipe: any) => {
              return recipe.fields.kategorija.includes('Zdravi recepti') &&
                (!selectedSubcategory || recipe.fields.podkategorija.includes(selectedSubcategory));
            });

            combinedRecipes = [...filteredContentfulRecipes, ...filteredLocalStorageRecipes];
            console.log("Combined recipes:", combinedRecipes);

          } catch (error) {
            console.error("Error parsing recipes from localStorage", error);
          }
        }

        setRecipes(combinedRecipes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content from Contentful', error);
        setLoading(false);
      }
    };

    fetchAllRecipes();
  }, [selectedCategory, selectedSubcategory]);

  const clearFilters = () => {
    window.location.href = '/recipes/zdravi-recepti';
  };

  const openModal = (recipe: Recept) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <main className="grid grid-rows-[auto_auto_auto] min-h-screen w-full text-[#2E6431] justify-center">
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-center text-center my-16 px-4 sm:px-8">
        {/* Slike sa strane */}
        <Image
          src="/images/list.png"
          alt="cvijet"
          className="absolute top-[60px] left-[10px] hidden lg:block"
          width={96}
          height={50}
        />
        <Image
          src="/images/naranca.png"
          alt="Naranča"
          className="absolute top-[-30px] left-[150px] hidden lg:block"
          width={96}
          height={50}
        />
        <Image
          src="/images/cvijet.png"
          alt="Bosiljak"
          className="absolute bottom-[-50px] left-[150px] hidden lg:block"
          width={96}
          height={50}
        />
        <Image
          src="/images/prilog.png"
          alt="prilog"
          className="absolute top-[-70px] right-[150px] hidden lg:block"
          width={160}
          height={100}
        />
        <Image
          src="/images/avokado.png"
          alt="Avokado"
          className="absolute top-[60px] right-[5px] hidden lg:block"
          width={96}
          height={50}
        />
        <Image
          src="/images/meso.png"
          alt="meso"
          className="absolute bottom-[-50px] right-[100px] hidden lg:block"
          width={112}
          height={60}
        />
        <h1 className="text-[#2E6431] font-scintilla font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 drop-shadow-lg">Zdravi recepti</h1>
        <p className="text-base sm:text-lg md:text-xl font-sans m-6 text-gray-900 max-w-[90%] md:max-w-[700px]">
          Ovdje ćete pronaći recepte bogate vitaminima, vlaknima i esencijalnim nutrijentima, idealne za one koji žele održati zdrav način života.
          Bilo da se radi o laganim salatama, smoothie-ima, juhama ili punim obrocima, svaki recept je dizajniran da vam pruži energiju i podrži vaše zdravlje.
          Korištenje svježih, prirodnih sastojaka čini ove recepte izvrsnim izborom za održavanje ravnoteže u prehrani.
          Ova kategorija nije samo za one koji žele smršavjeti, već i za sve koji žele uživati u hrskavim, sočnim i ukusnim jelima bez osjećaja krivnje.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mt-8 w-full max-w-6xl flex flex-wrap justify-center gap-4">
        <Link href="/recipes/zdravi-recepti?subcategory=Zdravi deserti">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Zdravi deserti</button>
        </Link>
        <Link href="/recipes/zdravi-recepti?subcategory=Obroci za mršavljenje">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Obroci za mršavljenje</button>
        </Link>
        <Link href="/recipes/zdravi-recepti?subcategory=Zdravi napitci">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Zdravi napitci</button>
        </Link>
        <Link href="/recipes/zdravi-recepti?subcategory=Prehrana za sportaše">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Prehrana za sportaše</button>
        </Link>

        {/* Clear Filters Button */}
        <button onClick={clearFilters} className="px-6 py-2 bg-red-200 rounded-full text-red-800 hover:bg-red-300">
          Ukloni filtriranje
        </button>
      </div>
      {/* Recipes */}
      <div className="mt-10 grid p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse h-48 rounded-xl"></div>
          ))
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe.sys.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => openModal(recipe)}
            >
              {recipe.fields.slikaRecepta && (
                <div className="w-full h-48 relative">
                  <Image
                    src={typeof recipe.fields.slikaRecepta === 'string' ? recipe.fields.slikaRecepta : `https:${recipe.fields.slikaRecepta?.fields?.file?.url}`}
                    alt={recipe.fields.nazivRecepta}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900">{recipe.fields.nazivRecepta}</h2>
                <p className="text-gray-600 mt-2">
                  {recipe.fields.opisRecepta ? recipe.fields.opisRecepta.slice(0, 100) + "..." : "Kliknite za više."}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && selectedRecipe && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-8 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl transition-transform transform hover:scale-110"
            >
              <FaTimes />
            </button>

            {/* Naslov */}
            <h2 className="text-center text-3xl font-bold text-gray-800 mb-4">
              {selectedRecipe.fields.nazivRecepta}
            </h2>

            {/* Slika */}
            {selectedRecipe.fields.slikaRecepta && (
              <div className="w-full flex justify-center mb-4">
                <div className="w-full max-w-lg h-80 relative">
                  <Image
                    src={typeof selectedRecipe.fields.slikaRecepta === 'string' ? selectedRecipe.fields.slikaRecepta : `https:${selectedRecipe.fields.slikaRecepta?.fields?.file?.url}`}
                    alt={selectedRecipe.fields.nazivRecepta}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Opis, sastojci, koraci */}
            <div className="flex flex-col md:flex-row w-full text-gray-950">
              {/* Opis (lijevo) */}
              <div className="md:w-1/3 max-w-xs p-4">
                <h3 className="text-lg font-semibold mb-2">Opis</h3>
                <p className="text-gray-700">{selectedRecipe.fields.opisRecepta}</p>
              </div>

              {/* Sastojci (sredina) */}
              <div className="md:w-1/3 p-4">
                <h3 className="text-lg font-semibold mb-2">Sastojci</h3>
                <ul className="list-none space-y-2 text-gray-700 pl-4">
                  {selectedRecipe.fields.sastojci.split("\n").map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">{item.replace(/^[•-]\s?/, "")}</li>
                  ))}
                </ul>
              </div>

              {/* Koraci (desno) */}
              <div className="md:w-1/3 p-4">
                <h3 className="text-lg font-semibold mb-2">Upute za pripremu</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 pl-4">
                  {selectedRecipe.fields.uputeZaPripremu.split("\n").map((step: string, index: number) => (
                    <li key={index} className="text-gray-700">{step.replace(/^[•-]\s?/, "")}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Komentari */}
            <div className="w-full p-4 mt-6 border-t text-gray-950">
              <h3 className="text-lg font-semibold mb-2">Dodaj komentar</h3>
              <textarea
                className="w-full border rounded-lg p-2 text-gray-700"
                rows={3}
                placeholder="Napiši svoj komentar..."
                value=""
                onChange={() => { }}
              />
              <button
                className="mt-2 bg-[#8b5e34] p-3 rounded-lg font-semibold text-white hover:bg-[#cc7c57] transition"
                onClick={() => { }}
              >
                Dodaj komentar
              </button>

              {/* Prikaz komentara */}
              <div className="mt-4">
                {[].length > 0 && (
                  <>
                    <h4 className="text-lg font-semibold mb-2">Komentari</h4>
                    {[].map((kom, index) => (
                      <p key={index} className="bg-gray-100 p-2 rounded-lg mb-2">{kom}</p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <ZdraviReceptiPage />
    </Suspense>
  );
}
