"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

const SearchPageContent = () => {
  const [recipes, setRecipes] = useState<Recept[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recept[]>([]);
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedRecipe, setSelectedRecipe] = useState<Recept | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [komentar, setKomentar] = useState("");
  const [komentari, setKomentari] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const contentfulRecipes = await fetchRecipes();

        const localStorageRecipes = localStorage.getItem('recipes');
        let localRecipes = [];

        if (localStorageRecipes) {
          localRecipes = JSON.parse(localStorageRecipes).map((recipe: any) => ({
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
        }

        const combinedRecipes = [...contentfulRecipes, ...localRecipes];
        setRecipes(combinedRecipes);
        setFilteredRecipes(combinedRecipes.filter(recipe =>
          recipe.fields.nazivRecepta.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } catch (error) {
        console.error('Error fetching recipes', error);
      }
    };

    fetchAllRecipes();
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
    if (komentar.trim() !== "") {
      setKomentari([...komentari, komentar]);
      setKomentar(""); // Prazni input polje nakon dodavanja
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-300 mt-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Rezultati pretraživanja za "{searchTerm}"</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Unesite naziv recepta"
        className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 focus:ring focus:ring-gray-200 mb-6"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.sys.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => openModal(recipe)}
          >
            {recipe.fields.slikaRecepta && (
              <div className="w-full h-48 relative">
                <Image
                  src={typeof recipe.fields.slikaRecepta === 'string' ? recipe.fields.slikaRecepta : `https:${(recipe.fields.slikaRecepta as Asset).fields.file.url}`}
                  alt={recipe.fields.nazivRecepta}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{recipe.fields.nazivRecepta}</h2>
              <p className="text-gray-600 mt-2">{recipe.fields.opisRecepta ? recipe.fields.opisRecepta.slice(0, 100) + "..." : "Kliknite za više."}</p>
            </div>
          </div>
        ))}
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
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
              />
              <button
                className="mt-2 bg-[#8b5e34] p-3 rounded-lg font-semibold text-white hover:bg-[#cc7c57] transition"
                onClick={handleKomentarSubmit}
              >
                Dodaj komentar
              </button>

              {/* Prikaz komentara */}
              <div className="mt-4">
                {komentari.length > 0 && (
                  <h4 className="text-lg font-semibold mb-2">Komentari</h4>
                )}
                {komentari.map((kom, index) => (
                  <p key={index} className="bg-gray-100 p-2 rounded-lg mb-2">{kom}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;