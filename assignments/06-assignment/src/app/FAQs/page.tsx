export default function FaqComponent() {
  return (
    <section className="flex flex-col md:flex-row bg-cream text-gray-950 mt-16 mx-8 font-sans min-h-screen justify-center items-start">
      {/* FAQ naslov i gumb */}
      <div className="md:w-1/3 w-full mb-10 flex flex-col justify-start items-start text-left">
        <h1 className="text-4xl font-bold font-scintilla">FAQs</h1>
        <p className="text-lg mb-4">
          Ako imate dodatnih pitanja, slobodno nas kontaktirajte i uskoro ćete dobiti odgovor!
        </p>
        <button className="px-5 py-2 text-lg bg-[#fde4b5] text-gray-900 border-2 border-[#b2823b] rounded-full hover:scale-105 transition-transform duration-300">
          Kontakt
        </button>
      </div>

      {/* Pitanja i odgovori */}
      <div className="md:w-2/3 space-y-6 mx-auto">
        <div className="w-full text-left">
          <h3 className="text-xl font-semibold mb-2">Kako mogu pretraživati recepte na FlavorFuse platformi?</h3>
          <p className="text-base">
            Na početnoj stranici pronaći ćete tražilicu u koju možete unijeti sastojke, nazive jela ili ključne riječi.
            Također možete koristiti filtre prema kategorijama, prehrambenim ograničenjima i vremenu pripreme.
          </p>
        </div>
        <div className="w-full text-left">
          <h3 className="text-xl font-semibold mb-2">Moram li se registrirati za korištenje platforme?</h3>
          <p className="text-base">
            Ne, registracija nije obavezna za pregled recepata. Međutim, registrirani korisnici mogu spremati omiljene recepte,
            objavljivati vlastite recepte i ostavljati komentare.
          </p>
        </div>
        <div className="w-full text-left">
          <h3 className="text-xl font-semibold mb-2">Mogu li prilagoditi recepte svojim prehrambenim potrebama?</h3>
          <p className="text-base">
            Da! Naši filteri omogućuju pretragu recepata bez glutena, laktoze, veganskih i vegetarijanskih opcija, kao i recepata
            prilagođenih keto prehrani.
          </p>
        </div>
        <div className="w-full text-left">
          <h3 className="text-xl font-semibold mb-2">Kako mogu objaviti vlastiti recept?</h3>
          <p className="text-base">
            Jednostavno se registrirajte ili prijavite na svoj račun, kliknite na gumb Objavi recept i slijedite upute za unos
            sastojaka, uputa i fotografija vašeg jela.
          </p>
        </div>
      </div>
    </section>
  );
}
