"use client";

import Recipes from "./recipes/page";
import { useState, useEffect } from "react";
import PopularRecipes from "./popular-recipes/page";
import FaqComponent from "./FAQs/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserContext } from "./context/UserContext";
import MyRecipes from "./my-recipes/page";
import SurpriseButton from "./surprise-button/page";

const CookingTips = () => {
  const tips = [
    "Češnjak ogulite brže: Stavite ga u zdjelu, protresite 10 sekundi i ljuska će se odvojiti!",
    "Spremite svježe začinsko bilje: Zamrznite ga u posudicama za led s maslinovim uljem.",
    "Savršena tjestenina: Dodajte žlicu soli u vodu prije kuhanja za bolji okus.",
  ];

  return (
    <div className="my-20">
      <h1 className="text-center font-serif text-[#b2823b] text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md mb-16">
        BRZI SAVJETI ZA KUHANJE
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="relative bg-amber-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-200"
          >
            <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#8b5e34] rounded-full p-3">
              <span className="text-white font-bold font-serif text-lg">{index + 1}</span>
            </div>
            <p className="text-gray-900 text-center font-serif text-lg leading-relaxed mt-6">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ana K.",
      text: "FlavorFuse mi je olakšao pripremu obroka! Pronašla sam toliko zdravih recepata koji su savršeni za moju obitelj.",
    },
    {
      name: "Marko P.",
      text: "Obožavam funkciju 'Iznenadi me!' – svaki put dobijem novu ideju za večeru.",
    },
  ];

  return (
    <div className="my-10 py-16 rounded-3xl">
      <h1 className="text-center font-serif text-[#b2823b] text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md mb-12">
        ŠTO KAŽU NAŠI KORISNICI
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-5xl mx-auto px-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-200"
          >
            <p className="text-gray-900 text-lg font-serif italic mb-6 leading-relaxed">"{testimonial.text}"</p>
            <p className="bottom-8 right-4 text-[#8b5e34] font-serif font-semibold text-xl">{testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Pretplata na newsletter:", email);
    setEmail("");
  };

  return (
    <div className="my-10 py-12 rounded-3xl">
      <h1 className="text-center text-[#b2823b] text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md mb-6">
        PRETPLATITE SE NA NEWSLETTER
      </h1>
      <p className="text-center text-gray-900 text-lg mb-8 max-w-md mx-auto">
        Primajte najnovije recepte i savjete za kuhanje direktno u vaš inbox!
      </p>
      <form onSubmit={handleSubmit} className="flex justify-center">
        <div className="flex w-full max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Unesite vaš e-mail"
            className="flex-grow px-4 py-2 rounded-l-full border border-[#8b5e34] focus:outline-none focus:ring-2 focus:ring-[#b2823b] text-gray-900"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 text-xs sm:text-sm md:text-lg bg-[#8b5e34] text-white font-semibold rounded-r-full hover:bg-[#b2823b] transition-colors duration-300"
          >
            Pretplati se
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Home() {
  const { userInitials, userName, setUserInitials, setUserName } = useUserContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userToken = Cookies.get("auth_token");
    console.log("Auth token: ", userToken);

    if (userToken) {
      const userName = localStorage.getItem("user_name");
      console.log("User name from localStorage: ", userName);

      if (userName) {
        const nameParts = userName.split(' ');
        const initials = nameParts[0].charAt(0).toUpperCase() + (nameParts[1]?.charAt(0).toUpperCase() || '');
        setUserInitials(initials);
        setUserName(userName);
        setIsLoggedIn(true);
      }
    }
  }, [setUserInitials, setUserName]);


  return (
    <main className="grid grid-rows-[auto_auto_auto] min-h-screen text-[#2E6431] max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
      {/* Hero sekcija */}
      <div className="relative flex flex-col items-center justify-center text-center my-16">
        {/* Slike sa strane */}
        <Image
          src="/images/list.png"
          alt="List"
          className="absolute top-[60px] left-[10px] hidden lg:block"
          width={96}
          height={50}
        />
        <Image
          src="/images/naranca.png"
          className="absolute top-[-30px] left-[150px] hidden lg:block"
          width={96}
          height={50} alt={""}
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
        <h1 className="text-[#2E6431] font-scintilla font-extrabold text-3xl sm:text-3xl md:text-5xl mb-2 drop-shadow-lg">FlavorFuse</h1>
        <h2 className="text-[#2E6431] font-italianno font-normal text-xl">-SINCE 2024-</h2>
        <p className="text-base sm:text-lg md:text-xl font-serif m-6 text-gray-900 max-w-[90%] md:max-w-[700px]">
          Ovdje istražujte, prilagođavajte i dijelite recepte koji odgovaraju vašem načinu života. Bilo da ste u potrazi za brzim obrocima, zdravim idejama ili posebnim jelima bez glutena - imamo sve što vam treba na dohvat ruke.
          Pronađite savršeni recept za svaki trenutak i pretvorite kuhanje u užitak!
        </p>
        {!isLoggedIn && (
          <div className="text-center mt-8">
            <button
              className="px-6 py-3 sm:px-6 sm:py-3 text-sm sm:text-lg bg-[#8b5e34] text-white font-semibold rounded-full shadow-md hover:bg-[#b2823b] transition-colors duration-300"
              onClick={() => router.push('/prijava')}
            >
              Prijavi se
            </button>
          </div>
        )}
      </div>


      {/* Popular Recipes */}
      <h1 className="text-center font-serif text-[#b2823b] text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md my-5">
        POZNATI RECEPTI
      </h1>
      <section className="flex flex-wrap justify-center items-center gap-4 px-4 sm:px-8">
        <PopularRecipes />
      </section>

      {/* Brzi savjeti */}
      <CookingTips />

      {/* SurpriseButton */}
      <h1 className="text-center font-serif text-[#b2823b] text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md my-10">
        ŠTO DANAS KUHATI?
      </h1>
      <div className="flex justify-center">
        <SurpriseButton />
      </div>

      {/* My Recipes (samo za prijavljene) */}
      {isLoggedIn && (
        <>
          <MyRecipes />
        </>
      )}

      {/* Kategorije recepata */}
      <h1 className="text-center font-serif text-[#b2823b] text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md my-5">KATEGORIJE</h1>
      <Recipes />

      {/* Testimoniali */}
      <Testimonials />

      {/* Newsletter */}
      <NewsletterSignup />

      {/* FAQ */}
      <FaqComponent />
    </main>
  );
}