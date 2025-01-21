import PostCard from "@/app/components/PostCard";
import FeaturedPost from "@/app/components/FeaturedPost";
import { fetchPosts } from "@/app/lib/data"

interface Post {
    id: number;
    title: string;
    content: string; 
    featured: boolean;
    excerpt: string;
    archived: boolean;
}

export default async function BlogPage() {
    // Fetch data
    const posts: Post[] = await fetchPosts()
    
    const featuredPost = posts.find((post) => post.featured === true);
    const otherPosts = posts.filter((post) => !post?.featured && !post?.archived);

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            {/* Featured Post Section */}
            <section className="max-w-screen-xl mx-auto px-6">
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    {featuredPost ? (
                        <FeaturedPost post={featuredPost} />
                    ) : (
                        <p className="text-center text-lg text-gray-500">No featured post available.</p>
                    )}
                </div>
            </section>

            {/* Other Posts Section */}
            <section className="max-w-screen-xl mx-auto px-6">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Other Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
        </div>
    );
}
