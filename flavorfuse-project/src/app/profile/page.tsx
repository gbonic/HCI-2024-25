"use client";

import { useUserContext } from "../context/UserContext";
import { useState } from "react";
import Link from "next/link";

const ProfilePage = () => {
  const { userName } = useUserContext();
  const [activeTab, setActiveTab] = useState("moji-recepti");

  const tabs = [
    { id: "moji-recepti", label: "Moji recepti" },
    { id: "omiljeni-recepti", label: "Omiljeni recepti" },
    { id: "isprobano", label: "Isprobano!" },
    { id: "o-meni", label: "O meni" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-300 mt-10">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-500"
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
        <h2 className="mt-4 text-2xl font-bold text-gray-800">{userName}</h2>
      </div>

      <div className="flex justify-around mt-6">
        <div className="text-center">
          <span className="block text-xl font-bold text-gray-800">0</span>
          <span className="text-gray-600">Moji recepti</span>
        </div>
        <div className="text-center">
          <span className="block text-xl font-bold text-gray-800">0</span>
          <span className="text-gray-600">Moji komentari</span>
        </div>
        <div className="text-center">
          <span className="block text-xl font-bold text-gray-800">0</span>
          <span className="text-gray-600">Moje ocjene</span>
        </div>
        <div className="text-center">
          <span className="block text-xl font-bold text-gray-800">0</span>
          <span className="text-gray-600">Skuhani recepti</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full font-semibold ${
              activeTab === tab.id
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "moji-recepti" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800">Moji recepti</h3>
            <p className="text-gray-500 mt-2">Nema pronađenih rezultata.</p>
          </div>
        )}
        {activeTab === "omiljeni-recepti" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800">Omiljeni recepti</h3>
            <p className="text-gray-500 mt-2">Nema pronađenih rezultata.</p>
          </div>
        )}
        {activeTab === "isprobano" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800">Isprobano!</h3>
            <p className="text-gray-500 mt-2">Nema pronađenih rezultata.</p>
          </div>
        )}
        {activeTab === "o-meni" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800">O meni</h3>
            <p className="text-gray-500 mt-2">Nema pronađenih rezultata.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;