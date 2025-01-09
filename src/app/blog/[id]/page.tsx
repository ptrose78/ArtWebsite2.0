
import {fetchBlogById} from "@/app/lib/data"

export default async function BlogPost({params}: { params: { id: string } }) {
    
    // Route -> /blog/[id]
    // URL -> /blog/1 (different requests from BlogCard)
    // `params` -> { id: '1' }
    const blog = await fetchBlogById(Number(params.id));
    
    return(
        <div>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
        </div>
    )
}