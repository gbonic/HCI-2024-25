"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FaTimes, FaUtensils, FaListUl, FaComment } from 'react-icons/fa';
import { createClient, Entry, Asset } from 'contentful';

const client = createClient({
  space: 'ocm9154cjmz1',
  accessToken: 'r7B6-Fb1TqITT79XXiA3igrdqBEtOwlHiS2hazq2T6o'
});

type Recept = {
  contentTypeId: string;
  sys: { id: string };
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
    ? { sys: entry.fields.slikaRecepta.sys, fields: entry.fields.slikaRecepta.fields, metadata: entry.fields.slikaRecepta.metadata }
    : undefined;

  return {
    contentTypeId: entry.sys.contentType.sys.id,
    sys: { id: entry.sys.id },
    fields: { nazivRecepta, sastojci, uputeZaPripremu, opisRecepta, kategorija, podkategorija, slikaRecepta },
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
      setKomentar("");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-800 mb-8 text-center">Pretraži recepte</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Unesi naziv recepta..."
          className="w-full max-w-xl mx-auto block p-4 rounded-full bg-white shadow-md border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 placeholder-gray-400"
        />
        <p className="text-center text-gray-600 mt-2">Rezultati za: "{searchTerm}"</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.sys.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => openModal(recipe)}
            >
              {recipe.fields.slikaRecepta && (
                <div className="w-full h-56 relative">
                  <Image
                    src={typeof recipe.fields.slikaRecepta === 'string' ? recipe.fields.slikaRecepta : `https:${(recipe.fields.slikaRecepta as Asset).fields.file.url}`}
                    alt={recipe.fields.nazivRecepta}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-2xl"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-800">{recipe.fields.nazivRecepta}</h2>
                <p className="text-gray-600 mt-2 line-clamp-2">{recipe.fields.opisRecepta || "Pogledaj detalje klikom!"}</p>
              </div>
            </div>
          ))}
          {filteredRecipes.length === 0 && (
            <p className="col-span-full text-center text-gray-500 mt-8">Nema rezultata za "{searchTerm}".</p>
          )}
        </div>

        {/* Modern Modal with Title Below Image */}
        {isModalOpen && selectedRecipe && (
          <div
            className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 px-2 sm:px-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-[90vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-500 scale-100 sm:scale-95 mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {selectedRecipe.fields.slikaRecepta && (
                  <div className="w-full h-60 sm:h-80 relative">
                    <Image
                      src={
                        typeof selectedRecipe.fields.slikaRecepta === "string"
                          ? selectedRecipe.fields.slikaRecepta
                          : `https:${selectedRecipe.fields.slikaRecepta?.fields?.file?.url}`
                      }
                      alt={selectedRecipe.fields.nazivRecepta}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-3xl" />
                  </div>
                )}
                <button
                  onClick={closeModal}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white bg-gray-900/70 p-2 sm:p-3 rounded-full hover:bg-gray-900/90 transition-all duration-200"
                  aria-label="Zatvori modal"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 bg-gradient-to-b from-white to-gray-50">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {selectedRecipe.fields.nazivRecepta}
                  </h2>
                  <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-baseline text-[#8b5e34] text-sm sm:text-base font-medium min-w-0">
                      <span className="mr-1 sm:mr-2 font-semibold whitespace-nowrap">Kategorija:</span>
                      <span className="flex-1">{selectedRecipe.fields.kategorija?.join(", ") || "Nema kategorije"}</span>
                    </div>
                    <div className="flex items-baseline text-[#8b5e34] text-sm sm:text-base font-medium min-w-0">
                      <span className="mr-1 sm:mr-2 font-semibold whitespace-nowrap">Podkategorija:</span>
                      <span className="flex-1">{selectedRecipe.fields.podkategorija?.join(", ") || "Nema podkategorije"}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2 sm:space-x-3">
                      <FaUtensils className="text-[#8b5e34] text-xl sm:text-2xl" />
                      <span>Opis</span>
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {selectedRecipe.fields.opisRecepta || "Nema opisa."}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2 sm:space-x-3">
                      <FaListUl className="text-[#8b5e34] text-xl sm:text-2xl" />
                      <span>Sastojci</span>
                    </h3>
                    <ul className="list-disc pl-5 sm:pl-6 text-gray-600 text-sm sm:text-base space-y-1 sm:space-y-2">
                      {selectedRecipe.fields.sastojci.split("\n").map((item, index) => (
                        <li key={index}>{item.replace(/^[•-]\s?/, "")}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2 sm:space-x-3">
                      <FaListUl className="text-[#8b5e34] text-xl sm:text-2xl" />
                      <span>Upute za pripremu</span>
                    </h3>
                    <ol className="list-decimal pl-5 sm:pl-6 text-gray-600 text-sm sm:text-base space-y-1 sm:space-y-2">
                      {selectedRecipe.fields.uputeZaPripremu.split("\n").map((step, index) => (
                        <li key={index}>{step.replace(/^[•-]\s?/, "")}</li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6 sm:pt-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                    <FaComment className="text-[#8b5e34] text-xl sm:text-2xl" />
                    <span>Komentari</span>
                  </h3>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 sm:p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f4c78c] transition-all duration-200 bg-white shadow-sm resize-none"
                    rows={4}
                    placeholder="Napiši svoj komentar..."
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                  />
                  <button
                    className="mt-3 sm:mt-4 bg-[#8b5e34] text-white py-2 sm:py-3 px-6 sm:px-8 rounded-xl hover:bg-[#6b4727] transition-all duration-200 shadow-md font-medium w-full sm:w-auto"
                    onClick={handleKomentarSubmit}
                  >
                    Objavi komentar
                  </button>
                  {komentari.length > 0 && (
                    <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                      {komentari.map((kom, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 p-3 sm:p-4 rounded-xl text-gray-700 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                          {kom}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-600">Učitavanje...</div>}>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;