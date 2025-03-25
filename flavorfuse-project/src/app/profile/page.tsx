"use client";

import { useUserContext } from "../context/UserContext";
import { useState, useEffect } from "react";

const ProfilePage = () => {
  const { userName, userEmail } = useUserContext();
  const [activeTab, setActiveTab] = useState("moji-recepti");
  const [userRecipes, setUserRecipes] = useState([]);

  useEffect(() => {
    const recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
    const filteredRecipes = recipes.filter((recipe) => recipe.userEmail === userEmail);
    setUserRecipes(filteredRecipes);
  }, [userEmail]);

  const tabs = [
    { id: "moji-recepti", label: "Moji recepti" },
    { id: "omiljeni-recepti", label: "Omiljeni recepti" },
    { id: "isprobano", label: "Isprobano!" },
    { id: "o-meni", label: "O meni" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-white">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <svg
                className="w-14 h-14 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4a4 4 0 110 8 4 4 0 010-8zm0 8c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-3xl font-bold">{userName || "Korisnik"}</h2>
            <p className="text-amber-100 text-sm mt-1">{userEmail}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-around py-6 bg-gray-50 border-b border-gray-200">
          {[
            { label: "Moji recepti", value: userRecipes.length },
            { label: "Moji komentari", value: 0 },
            { label: "Moje ocjene", value: 0 },
            { label: "Skuhani recepti", value: 0 },
          ].map((stat, index) => (
            <div key={index} className="text-center px-4 py-2">
              <span className="block text-2xl font-bold text-amber-600">{stat.value}</span>
              <span className="text-gray-600 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs Section */}
        <div className="flex flex-wrap justify-center gap-2 p-6 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {activeTab === "moji-recepti" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Moji recepti</h3>
              {userRecipes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nemaš još recepata? Kreiraj svoj prvi recept sada!
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {userRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="bg-amber-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100"
                    >
                      <h4 className="text-lg font-semibold text-amber-700">{recipe.title}</h4>
                      <p className="text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "omiljeni-recepti" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Omiljeni recepti</h3>
              <p className="text-gray-500 text-center py-8">
                Nema omiljenih recepata. Pronađi inspiraciju i dodaj ih ovdje!
              </p>
            </div>
          )}
          {activeTab === "isprobano" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Isprobano!</h3>
              <p className="text-gray-500 text-center py-8">
                Još nisi isprobao recepte? Vrijeme je za kuhanje!
              </p>
            </div>
          )}
          {activeTab === "o-meni" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">O meni</h3>
              <div className="bg-amber-50 p-6 rounded-xl shadow-sm">
                <p className="text-gray-600">
                  {userName ? `Pozdrav, ja sam ${userName}!` : "Pozdrav, ja sam korisnik!"}{" "}
                  Volim kuhati i dijeliti svoje recepte s FlavorFuse zajednicom.
                </p>
                <p className="text-gray-600 mt-2">Email: {userEmail || "Nije postavljen"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;