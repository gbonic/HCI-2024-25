"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import RecipeCard from '../recipe-card/page';
import RecipeModal from '../recipe-modal/page';
import { fetchRecipes, Recept, Asset } from '../../utils/contentfulClient';

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
              return recipe.fields.kategorija.includes('Brzo i jednostavno') &&
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
          setKomentar={() => { }}
          komentari={[]}
          handleKomentarSubmit={() => { }}
        />
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