import Link from 'next/link';

export default function FeaturedPost({post}) {
    return(
        <div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link href={`blog/${post.id}`} className="bg-teal-500 py-2 px-4 rounded-full hover:bg-teal-600">
                Read More
            </Link>
        </div>
    )
}