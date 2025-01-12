import Link from "next/link";
import Image from "next/image";

export type Recipe = {
  id: number;
  title: string;
  image: string;
  instructions: string;
};


// Dohvat svih postova
async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?number=50&apiKey=987de0fe95f0494cb10c0d59057bed32`);
  console.log(response);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.results; // Osiguraj da vraćaš niz
}

function processRecipe(recipe: Recipe) {
  const { id, title, image } = recipe;
  return (
    <div key={id} className="shadow-lg rounded-lg overflow-hidden bg-white">
      <Link
        href={`/blog/${id}`}
        className="block p-6  rounded-lg  shadow-md  transition-colors duration-200"
      >
        <Image src={image} alt={title} className="mb-2 w-full h-40 object-cover rounded-lg" width={160} height={160}/>
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-700 mt-2">Click to read more...</p>
        </div>
      </Link>
    </div>
  );
}

export default async function BlogPage() {
  const posts = await getRecipes();  // Dohvaćanje svih postova

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-center text-4xl font-bold mb-8">Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map(processRecipe)}
      </div>
    </main>
  );
}
