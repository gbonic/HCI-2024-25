"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { fetchRecipes, Recept, Asset } from '@/app/utils/contentfulClient';
import RecipeCard from '../recipe-card/page';
import RecipeModal from '../recipe-modal/page';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // Usklađeno sa Next.js 13


const DesertiPage = () => {
  const [recipes, setRecipes] = useState<Recept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recept | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams(); // Get the category filter from the URL
  const selectedCategory = searchParams.get('category') || ''; // Category from URL (Torte, Kolači, etc.)
  const selectedSubcategory = searchParams.get('subcategory') || ''; // Subcategory from URL (e.g., Torte)


  useEffect(() => {
    setLoading(true);

    const fetchAllRecipes = async () => {
      try {
        const contentfulRecipes = await fetchRecipes();

        const filteredContentfulRecipes = contentfulRecipes.filter((item) => {
          return Array.isArray(item.fields.kategorija) && item.fields.kategorija.some((kat) => kat === 'Brzo i jednostavno') &&
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
              return recipe.fields.kategorija.includes('Deserti') &&
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
    window.location.href = '/recipes/deserti';
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
        <h1 className="text-[#2E6431] font-scintilla font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 drop-shadow-lg">Deserti</h1>
        <p className="text-base sm:text-lg md:text-xl font-sans m-6 text-gray-900 max-w-[90%] md:max-w-[700px]">
          Deserti su slatki ili bogati obroci koji se obično poslužuju nakon glavnog jela.
          Često uključuju sastojke poput čokolade, voća, mlijeka, jaja i brašna, a mogu biti pečeni ili hladni.
          Popularni deserti uključuju kolače, torte, pudinge, voćne salate i sladolede.
          Oni su savršen način da se završi obrok, donoseći uživanje i zadovoljstvo.
          Osim što su ukusni, deserti često služe i kao središnji dio proslava i posebnih prigoda.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mt-8 w-full max-w-6xl flex flex-wrap justify-center gap-4">
        <Link href="/recipes/deserti?subcategory=Torte">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Torte</button>
        </Link>
        <Link href="/recipes/deserti?subcategory=Kolači">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Kolači</button>
        </Link>
        <Link href="/recipes/deserti?subcategory=Deserti u čaši">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Deserti u čaši</button>
        </Link>
        <Link href="/recipes/deserti?subcategory=Deserti do 5 sastojaka">
          <button className="px-6 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">Deserti do 5 sastojaka</button>
        </Link>
        {/* Clear Filters Button */}
        <button onClick={clearFilters} className="px-6 py-2 bg-red-200 rounded-full text-red-800 hover:bg-red-300">
          Ukloni filtriranje
        </button>
      </div>

      {/* Recipes */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse h-48 rounded-xl"></div>
          ))
        ) : (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.sys.id}
              recipe={recipe}
              onClick={() => openModal(recipe)}
            />
          ))
        )}
      </div>
      {isModalOpen && selectedRecipe && (
        <RecipeModal
        recipe={selectedRecipe}
        onClose={closeModal}
        komentar=""
        setKomentar={() => {}}
        komentari={[]}
        handleKomentarSubmit={() => {}}
      />
      )}
    </main>
  );
};

// Wrap in Suspense to handle async logic correctly
export default function Page() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <DesertiPage />
    </Suspense>
  );
}
