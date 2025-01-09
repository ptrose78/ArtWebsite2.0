
import Link from 'next/link';

export default function BlogCard({post}) {
    return (
        <div>
            <div>
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link href={`/blog/${post.id}`} className="text-teal-500 hover:underline">
                    Read More
                </Link>
            </div>
        </div>
    )
}