import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen text-[#b2823b] font-serif flex items-center justify-center p-6">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 animate-slide-in">
        {/* Tekst i dugme */}
        <div className="space-y-4 text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ups, ovdje nema ničega!</h1>
          <p className="text-lg md:text-xl">Stranica koju tražiš će biti uskoro dostupna.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#b2823b] text-white rounded-lg hover:bg-[#8b5e34] transition-colors duration-300"
          >
            Vrati se na početnu
          </Link>
        </div>
      </div>
    </div>
  );
}