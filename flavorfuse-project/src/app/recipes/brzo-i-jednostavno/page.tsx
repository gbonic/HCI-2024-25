"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

  const slikaRecepta = entry.fields.slikaRecepta &&
    (typeof entry.fields.slikaRecepta === "string" ||
      (typeof entry.fields.slikaRecepta === "object" &&
        "sys" in entry.fields.slikaRecepta &&
        "fields" in entry.fields.slikaRecepta))
    ? entry.fields.slikaRecepta
    : undefined;

  return {
    contentTypeId: entry.sys.contentType.sys.id,
    sys: { id: entry.sys.id },
    fields: { nazivRecepta, sastojci, uputeZaPripremu, opisRecepta, kategorija, podkategorija, slikaRecepta: slikaRecepta as unknown as string | Asset },
  };
};

const fetchRecipes = async (): Promise<Recept[]> => {
  const response = await client.getEntries({ content_type: 'recept', include: 2 });
  return response.items.map(mapEntryToRecept);
};

const BrzoIJednostavnoPage = () => {
  const { userEmail } = useUserContext();
  const [allRecipes, setAllRecipes] = useState<Recept[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recept | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [komentar, setKomentar] = useState("");
  const [komentari, setKomentari] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const contentfulRecipes = await fetchRecipes();
        const podkategorijeResponse = await client.getEntries({ content_type: "podkategorije", include: 2 });
        const localStorageRecipes = localStorage.getItem("recipes");
        let combinedRecipes = contentfulRecipes;

        if (localStorageRecipes) {
          try {
            const parsedRecipes = JSON.parse(localStorageRecipes);
            const formattedRecipes = parsedRecipes.map((recipe: any) => ({
              contentTypeId: "recept",
              sys: { id: recipe.id.toString() },
              fields: {
                nazivRecepta: recipe.title || "Nepoznato ime",
                sastojci: recipe.ingredients || "Nema sastojaka",
                uputeZaPripremu: recipe.steps || "Nema uputa",
                opisRecepta: recipe.description || "",
                kategorija: [recipe.category || ""],
                podkategorija: [recipe.subCategory || ""],
                slikaRecepta: recipe.image || undefined,
                isPublic: recipe.isPublic || "public",
              },
            }));
            combinedRecipes = [...contentfulRecipes, ...formattedRecipes];
          } catch (error) {
            console.error("Error parsing recipes from localStorage", error);
          }
        }

        // Filtriraj recepte samo za kategoriju "Zdravi recepti"
        const zdravRecepti = combinedRecipes.filter((recipe) =>
          recipe.fields.kategorija?.includes("Brzo i jednostavno")
        );

        // Primijeni pravila vidljivosti
        const visibleRecipes = zdravRecepti.filter((recipe) => {
          // Contentful recepti su uvijek javni jer nemaju isPublic
          if (!recipe.fields.hasOwnProperty("isPublic")) return true;
          // Za LocalStorage recepte: prijavljeni vide sve, neprijavljeni samo javne
          return userEmail ? true : recipe.fields.isPublic === "public";
        });

        // Dohvati podkategorije samo za "Zdravi recepti" kao niz stringova
        const zdravSubcategories = podkategorijeResponse.items
          .filter((podkat: any) => podkat.fields.kategorija?.fields.nazivKategorije === "Brzo i jednostavno")
          .map((podkat: any) => podkat.fields.nazivPodkategorije || "");

        setAllRecipes(visibleRecipes);
        setFilteredRecipes(visibleRecipes);
        setSubcategories(zdravSubcategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching content from Contentful", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userEmail]);

  useEffect(() => {
    const filtered = allRecipes.filter((recipe) => {
      const matchesSubcategory = !selectedSubcategory || recipe.fields.podkategorija?.includes(selectedSubcategory);
      return matchesSubcategory;
    });
    setFilteredRecipes(filtered);
  }, [selectedSubcategory, allRecipes]);

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const clearFilters = () => {
    setSelectedSubcategory("");
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
        <p className="text-base sm:text-lg md:text-xl font-serif m-6 text-gray-900 max-w-[90%] md:max-w-[700px]">
          Brzo i jednostavno recepti su savršen izbor za one koji žele pripremiti ukusne obroke u kratkom vremenu.
          S ovim receptima, nema potrebe za složenim pripremama ili dugotrajnim kuhanjem.
          Samo nekoliko sastojaka i brzi koraci, a rezultat je uvijek ukusan.
          Idealni su za zaposlene dane kada želite nešto ukusno bez puno truda.
          Prepustite se jednostavnosti i uživajte u brzom kuhanju!
        </p>
      </div>

      {/* Filter Buttons - Mobile Sliding Version */}
      <section className="lg:hidden w-full max-w-[90vw] mx-auto overflow-hidden px-4 relative">
        <div className="flex justify-start items-center overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#8b5e34] scrollbar-track-[#f5e8d9]">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => handleSubcategoryClick(subcategory)}
              className={`flex-shrink-0 snap-start w-[120px] h-[50px] rounded-full font-semibold text-sm flex items-center justify-center shadow-md ${selectedSubcategory === subcategory
                ? "bg-[#8b5e34] text-white"
                : "bg-[#f5e8d9] text-[#8b5e34] hover:bg-[#dcb794]"
                }`}
            >
              <span className="text-center px-2">{subcategory}</span>
            </button>
          ))}
          <button
            onClick={clearFilters}
            className="flex-shrink-0 snap-start w-[120px] h-[50px] rounded-full font-semibold text-sm flex items-center justify-center bg-red-200 text-red-800 hover:bg-red-300 shadow-md"
          >
            <span className="text-center px-2">Poništi filter</span>
          </button>
        </div>
      </section>
      {/* Filter Buttons - Desktop Version */}
      <div className="hidden lg:flex mt-8 max-w-6xl w-full flex-wrap justify-center gap-4">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory}
            onClick={() => handleSubcategoryClick(subcategory)}
            className={`font-semibold text-sm px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 w-[210px] h-[50px] flex items-center justify-center whitespace-normal ${selectedSubcategory === subcategory
              ? "bg-[#8b5e34] text-white"
              : "bg-[#f5e8d9] text-[#8b5e34] hover:bg-[#dcb794]"
              }`}
          >
            {subcategory}
          </button>
        ))}
        <button
          onClick={clearFilters}
          className="font-semibold text-sm px-4 py-2 rounded-full bg-red-200 text-red-800 hover:bg-red-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 w-[200px] h-[50px] flex items-center justify-center whitespace-normal"
        >
          Poništi filter
        </button>
      </div>

      <div className="mt-10 grid p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse h-[350px] rounded-xl" />
          ))
        ) : filteredRecipes.length === 0 ? (
          <p className="text-gray-900 text-center text-xl col-span-full">Nema dostupnih recepata.</p>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.sys.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col w-full sm:w-[350px] h-[350px] min-h-[350px]"
              onClick={() => openModal(recipe)}
            >
              <div className="w-full h-48 relative flex-shrink-0">
                <Image
                  src={
                    recipe.fields.slikaRecepta
                      ? typeof recipe.fields.slikaRecepta === "string"
                        ? recipe.fields.slikaRecepta
                        : `https:${recipe.fields.slikaRecepta?.fields?.file?.url}`
                      : "/images/placeholder-recept.jpg"
                  }
                  alt={recipe.fields.nazivRecepta}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{recipe.fields.nazivRecepta || "Nepoznati recept"}</h2>
                <p className="text-gray-600 mt-2 line-clamp-3 min-h-[60px] flex-1">
                  {recipe.fields.opisRecepta ? recipe.fields.opisRecepta.slice(0, 100) + "..." : "Kliknite za više informacija o receptu."}
                </p>
              </div>
            </div>
          ))
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
                <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="flex items-baseline text-gray-800 text-sm sm:text-base font-medium min-w-0">
                    <span className="mr-1 sm:mr-2 font-semibold whitespace-nowrap">Kategorija:</span>
                    <span className="flex-1">{selectedRecipe.fields.kategorija?.join(", ") || "Nema kategorije"}</span>
                  </div>
                  <div className="flex items-baseline text-gray-800 text-sm sm:text-base font-medium min-w-0">
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