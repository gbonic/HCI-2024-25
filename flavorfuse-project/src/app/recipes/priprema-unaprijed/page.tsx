"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaTimes, FaUtensils, FaListUl, FaComment } from 'react-icons/fa';
import { createClient, Entry, Asset } from 'contentful';
import { useUserContext } from '@/app/context/UserContext';

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
    isPublic?: string;
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

const PripremaUnaprijedPage = () => {
  const { userEmail } = useUserContext();
  const [recipes, setRecipes] = useState<Recept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recept | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const selectedSubcategory = searchParams.get('subcategory') || '';
  const [komentar, setKomentar] = useState("");
  const [komentari, setKomentari] = useState<string[]>([]);
  useEffect(() => {
    setLoading(true);

    const fetchAllRecipes = async () => {
      try {
        const contentfulRecipes = await fetchRecipes();

        const filteredContentfulRecipes = contentfulRecipes.filter((item) => {
          return Array.isArray(item.fields.kategorija) && item.fields.kategorija.some((kat) => kat === 'Jela za pripremu unaprijed') &&
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
                isPublic: recipe.isPublic || "public",
              },
            }));

            const filteredLocalStorageRecipes = formattedRecipes.filter((recipe: any) => {
              return recipe.fields.kategorija.includes('Jela za pripremu unaprijed') &&
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
    window.location.href = '/recipes/priprema-unaprijed';
  };

  const openModal = (recipe: Recept) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleKomentarSubmit = () => {
    if (komentar.trim()) {
      setKomentari([...komentari, komentar]);
      setKomentar("");
    }
  };

  const isLoggedIn = !!userEmail;

  return (
    <main className="grid grid-rows-[auto_auto_auto] min-h-screen text-[#2E6431] justify-center">
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
        <h1 className="text-[#2E6431] font-scintilla font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 drop-shadow-lg">Jela za pripremu unaprijed</h1>
        <p className="text-base sm:text-lg md:text-xl font-sans m-6 text-gray-900 max-w-[90%] md:max-w-[700px]">
          Kategorija Jela za pripremu unaprijed uključuje recepte koji su idealni za planiranje obroka unaprijed, štedeći vrijeme i energiju tokom radnog tjedna.
          Ova jela mogu se pripremiti u većim količinama i pohraniti za kasniju upotrebu, bilo u hladnjaku ili zamrzivaču, čime se osigurava brza i praktična rješenja za obrok.
          Bilo da se radi o ručkovima, večerama ili međuobrocima, jela za pripremu unaprijed omogućuju organizaciju prehrane bez stresa.
          Savršena su za zaposlene osobe koje žele zdrav i ukusan obrok, bez potrebe za svakodnevnim kuhanjem.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mt-8 w-full max-w-6xl flex flex-wrap justify-center gap-4">
        <Link href="/recipes/priprema-unaprijed?subcategory=Za cijeli tjedan">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Za cijeli tjedan</button>
        </Link>
        <Link href="/recipes/priprema-unaprijed?subcategory=Dugi rok trajanja">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Dugi rok trajanja</button>
        </Link>
        <Link href="/recipes/priprema-unaprijed?subcategory=Za putovanje">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Za putovanje</button>
        </Link>

        {/* Clear Filters Button */}
        <button onClick={clearFilters} className="px-6 py-2 bg-red-200 rounded-full text-red-800 hover:bg-red-300">
          Ukloni filtriranje
        </button>
      </div>

      {/* Recipes Grid */}
      <div className="mt-10 grid p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse h-48 rounded-xl" />
          ))
        ) : (
          recipes.map((recipe) => {
            if (
              recipe.contentTypeId === "recept" ||
              (recipe.contentTypeId === "local" && recipe.fields.isPublic === "private" && isLoggedIn)
            ) {
              return (
                <div
                  key={recipe.sys.id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                  onClick={() => openModal(recipe)}
                >
                  {recipe.fields.slikaRecepta && (
                    <div className="w-full h-48 relative">
                      <Image
                        src={
                          typeof recipe.fields.slikaRecepta === "string"
                            ? recipe.fields.slikaRecepta
                            : `https:${recipe.fields.slikaRecepta?.fields?.file?.url}`
                        }
                        alt={recipe.fields.nazivRecepta}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-xl"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900">{recipe.fields.nazivRecepta}</h2>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {recipe.fields.opisRecepta ? recipe.fields.opisRecepta.slice(0, 100) + "..." : "Kliknite za više."}
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })
        )}
      </div>

      {/* Modern Modal with Title Below Image */}
      {isModalOpen && selectedRecipe && (
        <div
          className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative transform transition-all duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Header */}
            <div className="relative">
              {selectedRecipe.fields.slikaRecepta && (
                <div className="w-full h-64 relative">
                  <Image
                    src={
                      typeof selectedRecipe.fields.slikaRecepta === "string"
                        ? selectedRecipe.fields.slikaRecepta
                        : `https:${selectedRecipe.fields.slikaRecepta?.fields?.file?.url}`
                    }
                    alt={selectedRecipe.fields.nazivRecepta}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-2xl"
                  />
                </div>
              )}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white bg-gray-800/80 p-2 rounded-full hover:bg-gray-800 transition"
                aria-label="Zatvori modal"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Recipe Title */}
              <h2 className="text-2xl font-bold text-gray-800 text-center">{selectedRecipe.fields.nazivRecepta}</h2>

              {/* Recipe Details */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <FaUtensils className="text-[#8b5e34]" />
                    <span>Opis</span>
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-md">
                    {selectedRecipe.fields.opisRecepta
                      ? selectedRecipe.fields.opisRecepta
                      : "Nema opisa."}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <FaListUl className="text-[#8b5e34]" />
                    <span>Sastojci</span>
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    {selectedRecipe.fields.sastojci.split("\n").map((item, index) => (
                      <li key={index}>{item.replace(/^[•-]\s?/, "")}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <FaListUl className="text-[#8b5e34]" />
                    <span>Upute za pripremu</span>
                  </h3>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-1 max-w-md">
                    {selectedRecipe.fields.uputeZaPripremu.split("\n").map((step, index) => (
                      <li key={index}>{step.replace(/^[•-]\s?/, "")}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <FaComment className="text-[#8b5e34]" />
                  <span>Komentari</span>
                </h3>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5e34] resize-none"
                  rows={4}
                  placeholder="Napiši svoj komentar..."
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                />
                <button
                  className="mt-4 bg-[#8b5e34] text-white py-2 px-6 rounded-md hover:bg-[#6b4727] transition w-full sm:w-auto sm:self-end"
                  onClick={handleKomentarSubmit}
                >
                  Objavi komentar
                </button>
                {komentar.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {komentari.map((kom, index) => (
                      <p key={index} className="bg-gray-100 p-3 rounded-md text-gray-600">
                        {kom}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// Wrap in Suspense to handle async logic correctly
export default function Page() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <PripremaUnaprijedPage />
    </Suspense>
  );
}
