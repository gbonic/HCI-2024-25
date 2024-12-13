
import Link from "next/link";
import './page.css'

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

 export const BASE_API_URL = "https://jsonplaceholder.typicode.com/posts";

// Dohvat svih postova
async function getPosts(): Promise<Post[]> {
  const res = await fetch(BASE_API_URL);
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();  // Dohvaćanje svih postova

  return (
    <main>
      <ul className="ul-blog">
        {posts.map((post: Post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
