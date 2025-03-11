type CommentSectionProps = {
    komentar: string;
    setKomentar: (value: string) => void;
    komentari: string[];
    handleKomentarSubmit: () => void;
  };
  
  const CommentSection = ({
    komentar,
    setKomentar,
    komentari,
    handleKomentarSubmit,
  }: CommentSectionProps) => {
    return (
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
    );
  };
  
  export default CommentSection;