import BlogCard from "@/app/components/BlogCard";
import FeaturedPost from "@/app/components/FeaturedPost"

export default function BlogPage() {
    //data
    const featuredPost = {
        id: 1,
        title: "Art is great",
        excerpt: "Art is great because of its many ways to create emotion.",
    }

    const latestPosts = [{
        id: 2,
        title: "Mona Lisa is over-rated",
        excerpt: "Art is great because of its many ways to create emotion.",
    },
    {
        id: 3,
        title: "Van Gogh did not have his ear cut off",
        excerpt: "Van Gogh said so.",
    }]
    

    return (
        <div>
            <section>
            <FeaturedPost post={featuredPost} />
            </section>
            
            <section>
            <div>
            {latestPosts.map((post)=>(
                <BlogCard key={post.id} post={post} />
            ))}
            </div>
            </section>
        </div>
    )
}