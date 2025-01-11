import Link from 'next/link';

export default function FeaturedPost({ post }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            
            <h1 className="text-4xl font-semibold text-gray-800 mb-4">{post.title}</h1>
            
            <p className="text-lg text-gray-600 mb-6">{post.excerpt}</p>

            <Link
                href={`blog/${post.id}`}
                className="inline-block bg-teal-500 text-white py-2 px-6 rounded-full text-lg hover:bg-teal-600 transition duration-300 ease-in-out"
            >
                Read More
            </Link>
        </div>
    );
}
