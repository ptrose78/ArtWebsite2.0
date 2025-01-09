
import {fetchBlogById} from "@/app/lib/data"

export default async function BlogPost({params}) {
    const {id} = params;
    const blog = await fetchBlogById(id);
    
    return(
        <div>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
        </div>
    )
}