"use client";

import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";

// Kategorije recepta (unchanged)
const categories = {
  "Prema vrsti obroka": ["Doručak", "Ručak", "Večera"],
  "Zdravi recepti": ["Zdravi deserti", "Obroci za mršavljenje", "Zdravi napitci", "Prehrana za sportaše"],
  "Brzo i jednostavno": ["Recepti za početnike", "Jela za 30 minuta", "Međuobroci", "Ukusno i jeftino"],
  "Tradicionalna jela": ["Blagdanska jela", "Sezonska jela", "Zimnica"],
  "Prilagođena prehrana": ["Vegansko", "Vegetarijansko", "Bez glutena", "Bez laktoze"],
  "Jela za pripremu unaprijed": ["Za cijeli tjedan", "Dugi rok trajanja", "Za putovanje"],
  "Deserti": ["Torte", "Kolači", "Deserti u čaši", "Deserti do 5 sastojaka"]
};

const AddRecipePage = () => {
  const { userEmail, setUserEmail } = useUserContext();
  const [recipes, setRecipes] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("recipes")) || [];
    }
    return [];
  });
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState("public");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (email) setUserEmail(email);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecipe = {
      id: Date.now(),
      title,
      category,
      subCategory,
      ingredients,
      steps,
      description,
      isPublic,
      image,
      userEmail,
    };
    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    setTitle("");
    setCategory("");
    setSubCategory("");
    setIngredients("");
    setSteps("");
    setDescription("");
    setIsPublic("public");
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-extrabold text-[#F28C38] mb-8 text-center font-['Caveat'] tracking-wide">
          Dodaj novi recept
        </h1>

        <div>
          <label className="block text-[#5A4A3B] font-semibold mb-2">Naziv recepta *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#F2E8D5] p-3 rounded-lg bg-[#FDF7F2] text-[#5A4A3B] focus:ring-2 focus:ring-[#F28C38] focus:outline-none transition duration-200"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#5A4A3B] font-semibold mb-2">Kategorija *</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
              }}
              className="w-full border border-[#F2E8D5] p-3 rounded-lg bg-[#FDF7F2] text-[#5A4A3B] focus:ring-2 focus:ring-[#F28C38] focus:outline-none transition duration-200"
              required
            >
              <option value="" disabled>Odaberi kategoriju</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {category && (
            <div>
              <label className="block text-[#5A4A3B] font-semibold mb-2">Podkategorija *</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full border border-[#F2E8D5] p-3 rounded-lg bg-[#FDF7F2] text-[#5A4A3B] focus:ring-2 focus:ring-[#F28C38] focus:outline-none transition duration-200"
                required
              >
                <option value="" disabled>Odaberi podkategoriju</option>
                {categories[category].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-[#5A4A3B] font-semibold mb-2">Sastojci *</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full border border-[#F2E8D5] p-3 rounded-lg bg-[#FDF7F2] text-[#5A4A3B] focus:ring-2 focus:ring-[#F28C38] focus:outline-none h-32 resize-none transition duration-200"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-[#5A4A3B] font-semibold mb-2">Koraci pripreme *</label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full border border-[#F2E8D5] p-3 rounded-lg bg-[#FDF7F2] text-[#5A4A3B] focus:ring-2 focus:ring-[#F28C38] focus:outline-none h-32 resize-none transition duration-200"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-[#5A4A3B] font-semibold mb-2">Opis *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#F2E8D5] p-3 rounded-lg bg-[#FDF7F2] text-[#5A4A3B] focus:ring-2 focus:ring-[#F28C38] focus:outline-none h-32 resize-none transition duration-200"
              required
            ></textarea>
          </div>
        </div>

        <div>
          <label className="block text-[#5A4A3B] font-semibold mb-2">Podijeli fotografiju recepta *</label>
          <p className="text-[#8A9A5B] mb-3 text-sm">PNG ili JPG, max. 10MB</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="file-upload"
            required
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block bg-[#F28C38] text-white py-2 px-6 rounded-full font-semibold hover:bg-[#E07B30] transition duration-300"
          >
            Priložite fotografiju
          </label>
          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="Preview"
                className="w-full max-w-md h-auto rounded-xl shadow-md border border-[#F2E8D5]"
              />
            </div>
          )}
        </div>

        <div>
          <span className="block text-[#5A4A3B] font-semibold mb-3">Vidljivost recepta</span>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="public"
                checked={isPublic === "public"}
                onChange={() => setIsPublic("public")}
                className="form-radio text-[#F28C38] focus:ring-[#F28C38]"
              />
              <span className="ml-3 text-[#5A4A3B]">Javan recept</span>
            </label>
            <p className="text-[#8A9A5B] text-sm ml-7">Svi imaju pristup receptu.</p>
            <label className="flex items-center">
              <input
                type="radio"
                value="private"
                checked={isPublic === "private"}
                onChange={() => setIsPublic("private")}
                className="form-radio text-[#F28C38] focus:ring-[#F28C38]"
              />
              <span className="ml-3 text-[#5A4A3B]">Privatan recept</span>
            </label>
            <p className="text-[#8A9A5B] text-sm ml-7">Recept je vidljiv samo prijavljenim korisnicima.</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#F28C38] text-white py-3 rounded-full font-bold text-lg hover:bg-[#E07B30] transition duration-300 shadow-md"
        >
          OBJAVITE RECEPT
        </button>
      </form>
    </div>
  );
};

export default AddRecipePage;