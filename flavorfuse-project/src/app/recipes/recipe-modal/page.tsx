import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

type RecipeModalProps = {
  recipe: any;
  onClose: () => void;
  komentar: string;
  setKomentar: (value: string) => void;
  komentari: string[];
  handleKomentarSubmit: () => void;
};

const RecipeModal = ({
  recipe,
  onClose,
  komentar,
  setKomentar,
  komentari,
  handleKomentarSubmit,
}: RecipeModalProps) => {

  const imageUrl = recipe.fields.slikaRecepta?.fields?.file?.url ? `https:${recipe.fields.slikaRecepta.fields.file.url}` : recipe.fields.slikaRecepta;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl transition-transform transform hover:scale-110"
        >
          <FaTimes />
        </button>

        {/* Naslov */}
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-4">
          {recipe.fields.nazivRecepta}
        </h2>

        {/* Slika */}
        {recipe.fields.slikaRecepta && (
          <div className="w-full flex justify-center mb-4">
            <div className="w-full max-w-lg h-80 relative">
              <Image
                src={imageUrl}
                alt={recipe.fields.nazivRecepta}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Opis, sastojci, koraci */}
        <div className="flex flex-col md:flex-row w-full text-gray-950">
          {/* Opis (lijevo) */}
          <div className="md:w-1/3 max-w-xs p-4">
            <h3 className="text-lg font-semibold mb-2">Opis</h3>
            <p className="text-gray-700">{recipe.fields.opisRecepta}</p>
          </div>

          {/* Sastojci (sredina) */}
          <div className="md:w-1/3 p-4">
            <h3 className="text-lg font-semibold mb-2">Sastojci</h3>
            <ul className="list-none space-y-2 text-gray-700 pl-4">
              {recipe.fields.sastojci.split("\n").map((item: string, index: number) => (
                <li key={index} className="text-gray-700">{item.replace(/^[•-]\s?/, "")}</li>
              ))}
            </ul>
          </div>

          {/* Koraci (desno) */}
          <div className="md:w-1/3 p-4">
            <h3 className="text-lg font-semibold mb-2">Upute za pripremu</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 pl-4">
              {recipe.fields.uputeZaPripremu.split("\n").map((step: string, index: number) => (
                <li key={index} className="text-gray-700">{step.replace(/^[•-]\s?/, "")}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Komentari */}
        <div className="w-full p-4 mt-6 border-t text-gray-950">
          <h3 className="text-lg font-semibold mb-2">Dodaj komentar</h3>
          <textarea
            className="w-full border rounded-lg p-2 text-gray-700"
            rows={3}
            placeholder="Napiši svoj komentar..."
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
          />
          <button
            className="mt-2 bg-[#8b5e34] p-3 rounded-lg font-semibold text-white hover:bg-[#cc7c57] transition"
            onClick={handleKomentarSubmit}
          >
            Dodaj komentar
          </button>

          {/* Prikaz komentara */}
          <div className="mt-4">
            {komentari.length > 0 && (
              <h4 className="text-lg font-semibold mb-2">Komentari</h4>
            )}
            {komentari.map((kom, index) => (
              <p key={index} className="bg-gray-100 p-2 rounded-lg mb-2">{kom}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;