"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import Image from "next/image";

const MyRecipes = () => {
  const { userEmail } = useUserContext();
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const userRecipes = storedRecipes.filter(recipe => recipe.userEmail === userEmail);
    setRecipes(userRecipes);
  }, [userEmail]);

  return (
    <section className="my-16 px-4 sm:px-8 max-w-6xl mx-auto">
      <h1 className="text-center font-serif text-[#b2823b] text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md mb-8">MOJI RECEPTI</h1>
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center items-center ">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-amber-50 flex flex-col shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer">
              {recipe.image && (
                <div className="w-72 h-48 relative">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{recipe.title}</h2>
                <p className="text-gray-600 mt-2">
                  Kliknite za više...
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">Još niste dodali nijedan recept. Dodajte svoj prvi recept i podijelite ga s drugima!</p>
        </div>
      )}
      <div className="text-center mt-8">
        <button
          className="px-6 py-3 text-sm sm:text-lg bg-[#8b5e34] text-white font-semibold rounded-full shadow-md hover:bg-[#b2823b] transition-colors duration-300"
          onClick={() => router.push('/add-recipe')}
        >
          Dodaj recept
        </button>
      </div>
    </section>
  );
};

export default MyRecipes;
