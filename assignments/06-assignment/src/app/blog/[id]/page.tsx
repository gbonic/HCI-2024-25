import Link from "next/link";
import { BASE_API_URL } from "../constants";
import type { Post } from "../page";
import './page.css';


type BlogPostProps = {
  params: { id: string };
};

async function getPost(id: string): Promise<Post> {
  const data = await fetch(`${BASE_API_URL}/posts/${id}`);
  return data.json();
}


export default async function BlogPost({ params }:
BlogPostProps) {
  const post = await getPost(params.id);
  const { id, title, body } = post;
  
  return (
    <main className="blog-id">
      <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
      ></Link>
      <h1>Post {id}: {title}</h1>
      <p>{body}</p>

    </main>
  );
}
