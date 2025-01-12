import Link from "next/link";
import type { Recipe } from "../page";
import './page.css';
import Image from "next/image";

type BlogPostProps = {
  params: { id: string };
};

async function getRecipe(id: string): Promise<Recipe> {
  const data = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=987de0fe95f0494cb10c0d59057bed32`);
  return data.json();
}


export default async function BlogPost({ params }:
BlogPostProps) {
  const recipe = await getRecipe(params.id);
  const { title, image, instructions } = recipe;

  
  return (
    <main className="blog-id">
      <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
      ></Link>
      <h1 className="text-3xl font-bold">{title}</h1>
      <Image src={image} alt={title} className="my-4 w-full h-60 object-cover rounded-lg" width={160} height={160} />
      <p>{instructions}</p>
    </main>
  );
}
