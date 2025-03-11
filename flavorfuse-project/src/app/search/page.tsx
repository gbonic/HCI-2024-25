"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import RecipeModal from '../recipes/recipe-modal/page';
import { fetchRecipes, Recept, Asset } from '../utils/contentfulClient';

const SearchPage = () => {
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
                <RecipeModal
                    recipe={selectedRecipe}
                    onClose={closeModal}
                    komentar={komentar}
                    setKomentar={setKomentar}
                    komentari={komentari}
                    handleKomentarSubmit={handleKomentarSubmit}
                />
            )}
        </div>
    );
};

export default SearchPage;