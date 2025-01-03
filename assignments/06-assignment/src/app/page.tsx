"use client";

import Recipes from "./recipes/page";
import { useState } from "react";
import RegistrationModal from "./registration-modal/page";

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
        <p className="text-5xl font-italianno mb-6 text-[#2E6431] w-[500px]">
          Pronađite inspiraciju za svaki obrok i otkrijte recepte koji spajaju ljude.
        </p>

        {!isRegistered && (
        <button
          className="px-5 py-2 text-lg bg-[#1e1e1e21] text-[#2E6431] rounded-lg hover:bg-[#2E6431] hover:text-white"
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
