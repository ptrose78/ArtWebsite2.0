import { fetchPosts } from "@/app/lib/data";
import PostList from "@/app/components/PostList"; // Import the client component

export default async function PostSection() {
    const posts = await fetchPosts();

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Existing Post Titles</h1>
            <PostList posts={posts} />
        </div>
    );
}
