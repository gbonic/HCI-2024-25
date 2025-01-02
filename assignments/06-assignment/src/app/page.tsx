export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center text-[#2E6431]">
      <div className="flex flex-col center items-center justify-center text-center mt-20 mb-20">
        <p className="text-5xl font-italianno mb-8 text-[#2E6431] w-[500px]">
          Pronađite inspiraciju za svaki obrok i otkrijte recepte koji spajaju ljude.
        </p>
        <button className="px-5 py-2 text-lg bg-[#1e1e1e21] text-[#2E6431] rounded-lg hover:bg-[#2E6431] hover:text-white">
          Registriraj se
        </button>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-6">
        <a href="/recipes/1" className="group">
          <img
            src="./images/cokoladna-torta.jpg"
            alt="Recept 1"
            className="w-64 h-40 object-cover rounded-md group-hover:opacity-75"
          />
          <p className="mt-2 text-center text-lg font-medium group-hover:underline">
            Čokoladna torta
          </p>
        </a>
        <a href="/recipes/2" className="group">
          <img
            src="/images/pizza-margherita.jpg"
            alt="Recept 2"
            className="w-64 h-40 object-cover rounded-md group-hover:opacity-75"
          />
          <p className="mt-2 text-center text-lg font-medium group-hover:underline">
            Pizza Margherita
          </p>
        </a>
        <a href="/recipes/3" className="group">
          <img
            src="/images/lazanje.jpg"
            alt="Recept 3"
            className="w-64 h-40 object-cover rounded-md group-hover:opacity-75"
          />
          <p className="mt-2 text-center text-lg font-medium group-hover:underline">
            Lazanje
          </p>
        </a>
        <a href="/recipes/4" className="group">
          <img
            src="/images/salata-piletina.jpg"
            alt="Recept 4"
            className="w-64 h-40 object-cover rounded-md group-hover:opacity-75"
          />
          <p className="mt-2 text-center text-lg font-medium group-hover:underline">
            Salata od piletine
          </p>
        </a>
      </div>
      <section className="flex flex-col md:flex-row justify-between items-start mt-20 mb-20 px-8">

        <div className="w-full md:w-1/3 bg-[#2E6431] text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
          <p>📧 Email: info@flavorfuse.com</p>
          <p>📞 Telefon: +385 99 123 4567</p>
          <p>🏢 Adresa: Bilo koja</p>
        </div>

        <div className="w-full md:w-2/3 bg-[#f4f4f4] text-[#2E6431] p-6 rounded-lg shadow-md mt-8 md:mt-0 md:ml-8">
          <h2 className="text-2xl font-bold mb-4">Često postavljana pitanja</h2>
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
