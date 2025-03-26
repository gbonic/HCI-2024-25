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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
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
                  </div>  </div>

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