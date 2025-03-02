"use client";

import Recipes from "./recipes/page";
import { useState, useEffect } from "react";
import PopularRecipes from "./popular-recipes/page";
import FaqComponent from "./FAQs/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserContext } from "./context/UserContext";

export default function Home() {
  const { userInitials, userName, setUserInitials, setUserName } = useUserContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userToken = Cookies.get("auth_token");
    console.log("Auth token: ", userToken); // Provjera tokena

    if (userToken) {
      const userName = localStorage.getItem("user_name");
      console.log("User name from localStorage: ", userName); // Provjera imena korisnika

      if (userName) {
        const nameParts = userName.split(' ');
        const initials = nameParts[0].charAt(0).toUpperCase() + (nameParts[1]?.charAt(0).toUpperCase() || '');
        setUserInitials(initials);
        setUserName(userName);
        setIsLoggedIn(true);
      }
    }
  }, [setUserInitials, setUserName]);

  const handleLoginClick = () => {
    router.push("/prijava");
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user_name");
    setUserInitials(null);
    setUserName(null);
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <main className="grid grid-rows-[auto_auto_auto] min-h-screen text-[#2E6431] justify-center sm:px-8">
      {/* Hero sekcija */}
      <div className="relative flex flex-col items-center justify-center text-center my-16">
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
        <h1 className="text-[#2E6431] font-scintilla font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 drop-shadow-lg">FlavorFuse</h1>
        <h2 className="text-[#2E6431] font-italianno font-normal">-SINCE 2024-</h2>
        <p className="text-base sm:text-lg md:text-xl font-sans m-6 text-gray-900 max-w-[90%] md:max-w-[700px]">
          Ovdje istražujte, prilagođavajte i dijelite recepte koji odgovaraju vašem načinu života. Bilo da ste u potrazi za brzim obrocima, zdravim idejama ili posebnim jelima bez glutena - imamo sve što vam treba na dohvat ruke.
          Pronađite savršeni recept za svaki trenutak i pretvorite kuhanje u užitak!
        </p>
        {!isLoggedIn && (
          <button
            className="px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-lg bg-[#fde4b5] text-gray-900 border-2 border-[#b2823b] rounded-full hover:scale-105 transition-transform duration-300"
            onClick={handleLoginClick}
          >
            Prijavi se
          </button>
        )}
      </div>
      <h1 className="items-center justify-center text-center font-italianno text-[#b2823b] text-4xl font-bold drop-shadow-md my-16">POZNATI RECEPTI</h1>
      {/* Kategorije poznatih recepata */}
      <section className="flex flex-wrap justify-center items-center gap-4 px-8">
        <PopularRecipes />
      </section>

      <h1 className="items-center justify-center text-center font-italianno text-[#b2823b] text-4xl font-bold drop-shadow-md my-16">KATEGORIJE</h1>
      {/* Kategorije recepata */}
      <section className="flex flex-wrap justify-center items-center px-8">
        <Recipes />
      </section>

      <FaqComponent />
    </main>
  );
}