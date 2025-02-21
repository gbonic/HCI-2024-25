"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { createClient, Entry, Asset } from 'contentful';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
    slikaRecepta?: Asset;
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

const BrzoIJednostavnoPage = () => {
  const [recipes, setRecipes] = useState<Recept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recept | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const selectedSubcategory = searchParams.get('subcategory') || '';

  useEffect(() => {
    setLoading(true);
    client.getEntries({ content_type: 'recept' })
      .then((response) => {
        const filteredRecipes = response.items
          .filter((item) => {
            return Array.isArray(item.fields.kategorija) && item.fields.kategorija.some((kat) => kat.fields.nazivKategorije === 'Brzo i jednostavno');
          })
          .map(mapEntryToRecept);

        if (selectedSubcategory) {
          setRecipes(filteredRecipes.filter((recipe) => recipe.fields.podkategorija?.includes(selectedSubcategory)));
        } else {
          setRecipes(filteredRecipes);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching content from Contentful', error);
        setLoading(false);
      });
  }, [selectedCategory, selectedSubcategory]);

  const clearFilters = () => {
    window.location.href = '/recipes/brzo-i-jednostavno';
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
    <main className="grid grid-rows-[auto_auto_auto] min-h-screen text-[#2E6431] justify-center w-full max-w-none ">
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-center text-center my-16 px-4 sm:px-8">
        {/* Slike sa strane */}
        <Image
          src="/images/list.png"
          alt="cvijet"
          className="absolute top-[50px] left-[-50px] hidden lg:block"
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
        
        <h1 className="text-[#2E6431] font-scintilla font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 drop-shadow-lg">Brzo i jednostavno</h1>
        <p className="text-base sm:text-lg md:text-xl font-sans m-6 text-gray-900 max-w-[90%] md:max-w-[700px]">
          Brzo i jednostavno recepti su savršen izbor za one koji žele pripremiti ukusne obroke u kratkom vremenu.
          S ovim receptima, nema potrebe za složenim pripremama ili dugotrajnim kuhanjem.
          Samo nekoliko sastojaka i brzi koraci, a rezultat je uvijek ukusan.
          Idealni su za zaposlene dane kada želite nešto ukusno bez puno truda.
          Prepustite se jednostavnosti i uživajte u brzom kuhanju!
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mt-8 w-full max-w-6xl flex flex-wrap justify-center gap-4">
        <Link href="/recipes/brzo-i-jednostavno?subcategory=Recepti za početnike">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Recepti za početnike</button>
        </Link>
        <Link href="/recipes/brzo-i-jednostavno?subcategory=Jela za 30 minuta">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Jela za 30 minuta</button>
        </Link>
        <Link href="/recipes/brzo-i-jednostavno?subcategory=Međuobroci">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Međuobroci</button>
        </Link>
        <Link href="/recipes/brzo-i-jednostavno?subcategory=Ukusno i jeftino">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Ukusno i jeftino</button>
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
              onClick={() => openModal(recipe)}>
              {recipe.fields.slikaRecepta && (
                <div className="w-full h-48 relative">
                  <Image
                    src={`https:${recipe.fields.slikaRecepta.fields.file.url}`}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row space-x-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl transition-transform transform hover:scale-110">&times;</button>

            {selectedRecipe.fields.slikaRecepta && (
              <div className="md:w-1/2 flex justify-center items-center p-4">
                <div className="w-full h-96 relative">
                  <Image
                    src={`https:${selectedRecipe.fields.slikaRecepta.fields.file.url}`}
                    alt={selectedRecipe.fields.nazivRecepta}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="md:w-1/2 p-4 text-gray-700">
              <h2 className="text-center text-3xl font-bold text-gray-800 mb-4">{selectedRecipe.fields.nazivRecepta}</h2>

              <h3 className="text-lg font-semibold mb-2">Sastojci</h3>
              <ul className="list-none space-y-2 text-gray-700 pl-4">
                {selectedRecipe.fields.sastojci.split('\n').map((item, index) => (
                  <li key={index} className="text-gray-700">{item.replace(/^[•-]\s?/, '')}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mt-4 mb-2">Upute za pripremu</h3>
              <ol className="list-none list-inside space-y-2 text-gray-700 pl-4">
                {selectedRecipe.fields.uputeZaPripremu.split('\n').map((step, index) => (
                  <li key={index} className="text-gray-700">{step.replace(/^[•-]\s?/, '')}</li>
                ))}
              </ol>

              <h3 className="text-lg font-semibold mt-4 mb-2">Opis</h3>
              <p className="text-gray-700">{selectedRecipe.fields.opisRecepta}</p>
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
      <BrzoIJednostavnoPage />
    </Suspense>
  );
}