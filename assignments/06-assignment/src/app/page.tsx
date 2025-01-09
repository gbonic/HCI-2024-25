"use client";

import Recipes from "./recipes/page";
import { useState } from "react";
import RegistrationModal from "./registration-modal/RegistrationModal";
import PopularRecipes from "./popular-recipes/page";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInitials, setUserInitials] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // novo stanje


  const handleRegister = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    setUserInitials(initials);
    setIsRegistered(true);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <main className="grid grid-rows-[auto_auto_1fr] min-h-screen text-[#2E6431]">
      {/* Hero sekcija */}
      <div className="flex flex-col items-center justify-center text-center mt-16 mb-12">
        <h1 className="text-[#EB3D00] font-italianno font-extrabold text-4xl mb-2 drop-shadow-lg">FlavorFuse</h1>
        <h2 className="text-[#EB3D00] font-italianno font-normal">-SINCE 2024-</h2>
        <p className="text-1xl font-sans m-6 text-gray-900 w-[700px]">
          Ovdje istražujte, prilagođavajte i dijelite recepte koji odgovaraju vašem načinu života. Bilo da ste u potrazi za brzim obrocima, zdravim idejama ili posebnim jelima bez glutena - imamo sve što vam treba na dohvat ruke.
          Pronađite savršeni recept za svaki trenutak i pretvorite kuhanje u užitak!
        </p>

        {!isRegistered && (
          <button
            className="px-5 py-3 text-lg bg-[#fde4b5] text-gray-900 border-2 border-[#b2823b] rounded-full hover:scale-105 transition-transform duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            Registriraj se
          </button>
        )}
      </div>

      {/* Modal za registraciju */}
      {isModalOpen && (
        <RegistrationModal
          onClose={() => setIsModalOpen(false)}
          onRegister={handleRegister}
        />
      )}

      {/* Prikaz inicijala u gornjem desnom kutu */}
      {userInitials && (
        <div className="absolute top-4 right-4 w-10 h-10 mr-2 mt-1 bg-[#2E6431] text-white flex items-center justify-center rounded-full shadow-lg">
          <button onClick={handleDropdownToggle} className="w-full h-full flex items-center justify-center">
            {userInitials}
          </button>

          {/* Padajući izbornik */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white text-[#2E6431] rounded-lg shadow-lg p-2">
              <ul>
                <li className="px-4 py-2 hover:bg-[#f4f4f4] cursor-pointer">Dodaj recept</li>
                <li className="px-4 py-2 hover:bg-[#f4f4f4] cursor-pointer">Moj profil</li>
                <li className="px-4 py-2 hover:bg-[#f4f4f4] cursor-pointer">Odjava</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <h1 className="items-center justify-center text-center font-italianno text-[#b2823b] text-4xl font-bold drop-shadow-md">POZNATI RECEPTI</h1>
      {/* Kategorije poznatih recepata */}
      <section className="flex flex-wrap justify-center items-center gap-4 px-8">
        <PopularRecipes />
      </section>

      {/* Kategorije recepata */}
      <section className="flex flex-wrap justify-center items-center gap-8 px-8">
        <Recipes />
      </section>

      {/* Kontakt i FAQ */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 mb-12">
        {/* Kontakt */}
        <div className="w-full bg-[#2E6431] text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
          <p>📧 Email: info@flavorfuse.com</p>
          <p>📞 Telefon: +385 99 123 4567</p>
          <p>🏢 Adresa: Bilo koja</p>
        </div>

        {/* Često postavljana pitanja */}
        <div className="w-full bg-[#f4f4f4] text-[#2E6431] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Često postavljena pitanja</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">1. Kako se registrirati?</h3>
              <p>Da biste se registrirali, kliknite na gumb "Registriraj se" na početnoj stranici i ispunite tražene podatke.</p>
            </div>
            <div>
              <h3 className="font-semibold">2. Kako pronaći recepte?</h3>
              <p>Recepti su dostupni u kategoriji "Recepti" u glavnom izborniku. Možete ih pretražiti prema ključnim riječima.</p>
            </div>
            <div>
              <h3 className="font-semibold">3. Mogu li dodati svoje recepte?</h3>
              <p>Da, nakon registracije imate mogućnost dodavanja svojih recepata putem korisničkog profila.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
