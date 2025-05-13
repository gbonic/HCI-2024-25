"use client";

import { createClient, Entry, Asset } from "contentful";
import { useState } from "react";
import Image from "next/image";
import { FaTimes, FaUtensils, FaListUl } from "react-icons/fa";

const client = createClient({
  space: "ocm9154cjmz1",
  accessToken: "r7B6-Fb1TqITT79XXiA3igrdqBEtOwlHiS2hazq2T6o",
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
  const nazivRecepta = typeof entry.fields.nazivRecepta === "string" ? entry.fields.nazivRecepta : "Nepoznato ime";
  const sastojci = typeof entry.fields.sastojci === "string" ? entry.fields.sastojci : "Nepoznati sastojci";
  const uputeZaPripremu = typeof entry.fields.uputeZaPripremu === "string" ? entry.fields.uputeZaPripremu : "Nema uputa";
  const opisRecepta = typeof entry.fields.opisRecepta === "string" ? entry.fields.opisRecepta : "";
  const kategorija = Array.isArray(entry.fields.kategorija)
    ? entry.fields.kategorija.map((kat) => (typeof kat === "string" ? kat : (kat as any).fields?.nazivKategorije))
    : [];
  const podkategorija = Array.isArray(entry.fields.podkategorija)
    ? entry.fields.podkategorija.map((kat) => (typeof kat === "string" ? kat : (kat as any).fields?.nazivPodkategorije))
    : [];
  const slikaRecepta =
    entry.fields.slikaRecepta && (entry.fields.slikaRecepta as unknown as Asset).fields
      ? `https:${(entry.fields.slikaRecepta as unknown as Asset).fields.file.url}`
      : undefined;

  return {
    contentTypeId: entry.sys.contentType.sys.id,
    sys: { id: entry.sys.id },
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
  const response = await client.getEntries({ content_type: "recept" });
  console.log("Contentful recepti:", response.items);
  return response.items.map(mapEntryToRecept);
};

const getAllRecipes = async (): Promise<Recept[]> => {
  try {
    const contentfulRecipes = await fetchRecipes();
    const localStorageRecipes = localStorage.getItem("recipes");
    let combinedRecipes = contentfulRecipes;

    if (localStorageRecipes) {
      const parsedRecipes = JSON.parse(localStorageRecipes);
      console.log("LocalStorage recepti:", parsedRecipes);
      const formattedRecipes = parsedRecipes.map((recipe: any) => ({
        contentTypeId: "recept",
        sys: { id: recipe.id?.toString() || Math.random().toString() },
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
    }

    console.log("Svi recepti:", combinedRecipes);
    return combinedRecipes;
  } catch (error) {
    console.error("Greška pri dohvaćanju recepata:", error);
    return [];
  }
};

const SurpriseButton = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recept | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSurpriseClick = async () => {
    setLoading(true);
    const allRecipes = await getAllRecipes();
    if (allRecipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * allRecipes.length);
      setSelectedRecipe(allRecipes[randomIndex]);
    } else {
      setSelectedRecipe(null);
    }
    setLoading(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="text-center my-8">
      <button
        onClick={handleSurpriseClick}
        disabled={loading}
        className="px-6 py-3 bg-[#8b5e34] text-white font-semibold rounded-full shadow-md hover:bg-[#b2823b] transition-colors duration-300 disabled:opacity-50"
      >
        {loading ? "Tražim..." : "Iznenadi me!"}
      </button>

      {/* Centrirani grid s jednim receptom */}
      {selectedRecipe && (
        <div className="flex justify-center mt-8">
          <div
            key={selectedRecipe.sys.id}
            className="flex flex-col shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer w-72"
            onClick={openModal}
          >
            {selectedRecipe.fields.slikaRecepta && (
              <div className="w-72 h-48 relative">
                <Image
                  src={
                    typeof selectedRecipe.fields.slikaRecepta === "string"
                      ? selectedRecipe.fields.slikaRecepta
                      : `https:${selectedRecipe.fields.slikaRecepta?.fields?.file?.url}`
                  }
                  alt={selectedRecipe.fields.nazivRecepta}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">{selectedRecipe.fields.nazivRecepta}</h2>
              <p className="text-gray-600 mt-2">Kliknite za više...</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal s poravnanim tekstom lijevo */}
      {modalOpen && selectedRecipe && (
        <div
          className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative transform transition-all duration-300 scale-95"
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

            {/* Content s poravnanim tekstom lijevo */}
            <div className="p-6 space-y-6 text-left">
              {/* Recipe Title */}
              <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.fields.nazivRecepta}</h2>

              {/* Recipe Details */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <FaUtensils className="text-[#8b5e34]" />
                    <span>Opis</span>
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-md">
                    {selectedRecipe.fields.opisRecepta ? selectedRecipe.fields.opisRecepta : "Nema opisa."}
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
                  <ol className="list-decimal pl-5 text-gray-600 space-y-1">
                    {selectedRecipe.fields.uputeZaPripremu.split("\n").map((step, index) => (
                      <li key={index}>{step.replace(/^[•-]\s?/, "")}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurpriseButton;