"use client";

import { useState, useEffect } from "react";
import { createClient, Entry, Asset } from "contentful";
import Image from "next/image";
import { FaTimes, FaUtensils, FaListUl, FaComment } from "react-icons/fa";
import { useUserContext } from "../context/UserContext";

const client = createClient({
  space: "ocm9154cjmz1",
  accessToken: "r7B6-Fb1TqITT79XXiA3igrdqBEtOwlHiS2hazq2T6o",
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
    slikaRecepta?: Asset | string;
    isPublic?: string;
  };
};

const mapEntryToRecept = (entry: Entry<Recept>): Recept => {
  const nazivRecepta = typeof entry.fields.nazivRecepta === "string" ? entry.fields.nazivRecepta : "Nepoznato ime";
  const sastojci = typeof entry.fields.sastojci === "string" ? entry.fields.sastojci : "Nepoznati sastojci";
  const uputeZaPripremu = typeof entry.fields.uputeZaPripremu === "string" ? entry.fields.uputeZaPripremu : "Nema uputa";
  const opisRecepta = typeof entry.fields.opisRecepta === "string" ? entry.fields.opisRecepta : "";
  const kategorija = Array.isArray(entry.fields.kategorija)
    ? entry.fields.kategorija.map((kat) => (typeof kat === "string" ? kat : kat.fields.nazivKategorije))
    : [];
  const slikaRecepta =
    entry.fields.slikaRecepta && entry.fields.slikaRecepta.sys && entry.fields.slikaRecepta.fields
      ? { sys: entry.fields.slikaRecepta.sys, fields: entry.fields.slikaRecepta.fields, metadata: entry.fields.slikaRecepta.metadata }
      : undefined;

  return {
    contentTypeId: entry.sys.contentType.sys.id,
    sys: { id: entry.sys.id },
    fields: { nazivRecepta, sastojci, uputeZaPripremu, opisRecepta, kategorija, slikaRecepta },
  };
};

const fetchRecipes = async (): Promise<Recept[]> => {
  const response = await client.getEntries({ content_type: "recept" });
  return response.items.map(mapEntryToRecept);
};

const BlogPage = () => {
  const { userEmail } = useUserContext();
  const [recipes, setRecipes] = useState<Recept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recept | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [komentar, setKomentar] = useState("");
  const [komentari, setKomentari] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const contentfulRecipes = await fetchRecipes();
        const localStorageRecipes = localStorage.getItem("recipes");
        let localRecipes = [];

        if (localStorageRecipes) {
          localRecipes = JSON.parse(localStorageRecipes).map((recipe: any) => ({
            contentTypeId: "local",
            sys: { id: recipe.id.toString() },
            fields: {
              nazivRecepta: recipe.title || "Nepoznato ime",
              sastojci: recipe.ingredients || "Nema sastojaka",
              uputeZaPripremu: recipe.steps || "Nema uputa",
              opisRecepta: recipe.description || "",
              kategorija: [recipe.category || ""],
              slikaRecepta: recipe.image || undefined,
              isPublic: recipe.isPublic || "public",
            },
          }));
        }

        const combinedRecipes = [...contentfulRecipes, ...localRecipes];
        setRecipes(combinedRecipes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes", error);
        setLoading(false);
      }
    };

    fetchAllRecipes();
  }, []);

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
    <main className="grid grid-rows-[auto_auto_auto] min-h-screen justify-center">
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-center text-center my-16 px-4 sm:px-8">
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
        <h1 className="text-[#2E6431] font-scintilla font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 drop-shadow-lg">
          Blog - Recepti
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-900 max-w-[90%] md:max-w-[700px] leading-relaxed">
          Blog Recepti mjesto je gdje ljubitelji kuhanja mogu pronaći inspiraciju za ukusna jela.
          Bilo da tražite brze obroke, tradicionalne specijalitete ili zdrave alternative, ovdje ćete pronaći razne recepte prilagođene svakom ukusu.
          Svaki recept dolazi s jednostavnim uputama i korisnim savjetima za savršenu pripremu.
          Uz to, redovito dijelimo kulinarske trikove i ideje za kreativno eksperimentiranje u kuhinji.
          Pridružite nam se i otkrijte nove omiljene okuse!
        </p>
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
              recipe.fields.isPublic === "public" ||
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
                {komentari.length > 0 && (
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

export default BlogPage;