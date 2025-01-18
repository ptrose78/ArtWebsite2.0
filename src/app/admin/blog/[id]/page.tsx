import { fetchPostById } from "@/app/lib/data";
import PostForm from "@/app/components/PostForm";
import { notFound } from "next/navigation";

interface Post {
  title: string;
  content: string;
}

export default async function PostAdminPage({ params }) {
  
  const post = await fetchPostById(Number(params.id));

  if (!post) {
    notFound(); // Redirects to a 404 page
  }

  return (
    <div className="max-w-lg mx-auto p-2 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Update Post</h1>
      <PostForm initialPost={post} />
    </div>
  );
}
