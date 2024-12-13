import { Post } from "../page"; // Importiraj tip Post iz index stranice
import { BASE_API_URL } from "../page";
import './page.css';


type BlogPostProps = {
  params: { id: string };
};


// Dohvat jednog posta prema ID-u
async function getPost(id: string): Promise<Post> {
  const res = await fetch(`${BASE_API_URL}/${id}`);
  return res.json();
}


export default async function PostPage({ params }: BlogPostProps) {
  const post = await getPost(params.id);  // Dohvaćanje specifičnog posta

  return (
    <main className="blog-id">
      <h1>Post {post.id}: {post.title}</h1>
      <p>{post.body}</p>
    </main>
  );
}
