"use client";

import { useRouter } from "next/navigation";
export default function FaqComponent() {
  const router = useRouter();
  return (
    <section className="flex flex-col lg:flex-row text-gray-900 mt-16 mx-auto font-sans max-w-7xl px-6 py-12">
      {/* FAQ naslov i gumb */}
      <div className="lg:w-1/3 w-full mb-10 flex flex-col justify-start items-start text-left">
        <h1 className="text-[45px] font-bold font-sans text-[#8B5E34]">Česta pitanja</h1>
        <p className="text-xl text-gray-800 mt-4 leading-relaxed">
          Ako imate dodatnih pitanja, slobodno nas kontaktirajte i uskoro ćete dobiti odgovor!
        </p>
        <button
          className="mt-8 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg bg-[#8B5E34] text-white font-semibold rounded-full shadow-md hover:bg-[#B2823B] transition-transform duration-300 hover:scale-105"
          onClick={() => router.push('/kontakt')}
        >
          Kontaktirajte nas
        </button>
      </div>

      {/* Pitanja i odgovori */}
      <div className="lg:w-2/3 space-y-6 mx-auto">
        {[ 
          {
            question: "Kako mogu pretraživati recepte na FlavorFuse platformi?",
            answer: "Na početnoj stranici pronaći ćete tražilicu u koju možete unijeti sastojke, nazive jela ili ključne riječi. Također možete koristiti filtre prema kategorijama, prehrambenim ograničenjima i vremenu pripreme."
          },
          {
            question: "Moram li se registrirati za korištenje platforme?",
            answer: "Ne, registracija nije obavezna za pregled recepata. Međutim, registrirani korisnici mogu spremati omiljene recepte, objavljivati vlastite recepte i ostavljati komentare."
          },
          {
            question: "Mogu li prilagoditi recepte svojim prehrambenim potrebama?",
            answer: "Da! Naši filteri omogućuju pretragu recepata bez glutena, laktoze, veganskih i vegetarijanskih opcija, kao i recepata prilagođenih keto prehrani."
          },
          {
            question: "Kako mogu objaviti vlastiti recept?",
            answer: "Jednostavno se registrirajte ili prijavite na svoj račun, kliknite na gumb Objavi recept i slijedite upute za unos sastojaka, uputa i fotografija vašeg jela."
          }
        ].map((faq, index) => (
          <div key={index} className="w-full text-left p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold font-sans text-[#8B5E34] mb-2">{faq.question}</h3>
            <p className="text-base text-stone-900 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
