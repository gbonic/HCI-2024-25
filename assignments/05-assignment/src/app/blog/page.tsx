import Link from "next/link";
import './page.css';

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type BlogPageProps = {
  searchParams: { page: string };
};

export const BASE_API_URL = "https://jsonplaceholder.typicode.com";

// Dohvat svih postova
async function getPosts(): Promise<Post[]> {
  const data = await fetch(`${BASE_API_URL}/posts`);
  if (!data.ok) {
    throw new Error(`Failed to fetch posts: ${data.status} ${data.statusText}`);
  }
  return data.json();
}

function processPost(post: Post) {
  const { id, title } = post;
  return (
    <li key={id} className="mb-4">
      <Link
        href={`/blog/${id}`}
        className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors duration-200"
      >
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Post {id}: {title}
        </h2>
        <p className="font-normal text-gray-700">
          Click to read more about this fascinating topic...
        </p>
      </Link>
    </li>
  );
}

export default async function BlogPage( { searchParams }: BlogPageProps) {
  const posts = await getPosts();  // Dohvaćanje svih postova

  return (
    <main>
      <ul className="ul-blog">
        {posts.map(processPost)}
      </ul>
    </main>
  );
}
