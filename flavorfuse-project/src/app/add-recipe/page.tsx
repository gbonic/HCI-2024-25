"use client";

import { useState } from "react";

// Kategorije recepta
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
  const [recipes, setRecipes] = useState(() => {
    // Učitavanje recepata iz localStorage pri pokretanju
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
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
    };

    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);

    // Spremanje u localStorage
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));

    // Reset form
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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-300 mt-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Dodaj novi recept</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Naziv recepta *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 focus:ring focus:ring-gray-200"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Kategorija *</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory(""); // Resetiraj podkategoriju kada se promijeni kategorija
            }}
            className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 focus:ring focus:ring-gray-200"
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
            <label className="block text-gray-700 font-semibold mb-1">Podkategorija *</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 focus:ring focus:ring-gray-200"
              required
            >
              <option value="" disabled>Odaberi podkategoriju</option>
              {categories[category].map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Sastojci *</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 focus:ring focus:ring-gray-200"
              required
            ></textarea>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Koraci pripreme *</label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 focus:ring focus:ring-gray-200"
              required
            ></textarea>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Opis *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 focus:ring focus:ring-gray-200"
              required
            ></textarea>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Podijeli fotografije recepta koji si napravio/la: *</label>
          <p className="text-gray-500 mb-2">PNG ili JPG, max. 10MB</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="file-upload"
            required
          />
          <label htmlFor="file-upload" className="cursor-pointer inline-block bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100">
            Priložite fotografiju
          </label>
          {image && (
            <div className="mt-4">
              <img src={image} alt="Preview" className="w-full h-auto rounded-md" />
            </div>
          )}
        </div>

        <div>
          <span className="block text-gray-700 font-semibold mb-2">Vidljivost recepta</span>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              value="public"
              checked={isPublic === "public"}
              onChange={() => setIsPublic("public")}
              className="form-radio text-orange-500"
            />
            <span className="ml-2 text-gray-700">Javan recept</span>
          </label>
          <p className="text-gray-500 mb-2">Svi imaju pristup receptu.</p>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="private"
              checked={isPublic === "private"}
              onChange={() => setIsPublic("private")}
              className="form-radio text-gray-600"
            />
            <span className="ml-2 text-gray-700">Privatan recept</span>
          </label>
          <p className="text-gray-500">Recept je vidljiv samo prijavljenim korisnicima.</p>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition duration-300"
        >
          OBJAVITE RECEPT
        </button>
      </form>
    </div>
  );
};

export default AddRecipePage;