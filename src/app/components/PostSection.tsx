'use client';

import { deletePost, updatePost, fetchPosts } from "@/app/lib/data";
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Post {
    id: number;
    title: string;
    content: string; 
    featured: boolean;
    archived: boolean;
}

export default function PostSection() {
    const [notification, setNotification] = useState<string>("");
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const data = await fetchPosts();
                setPosts(data || []); 
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setNotification("Failed to load posts. Please try again.");
                setTimeout(() => setNotification(""), 3000);
            }
        };

        getPosts();
    }, [notification]);

    async function handleDelete(post: Post) {
        try {
            await deletePost(post);
            setNotification("Deleted successfully!");
            setTimeout(() => setNotification(""), 3000);
        } catch (error) {
            console.error("Failed to delete post:", error);
            setNotification("Failed to delete. Try again.");
            setTimeout(() => setNotification(""), 3000);
        }
    }

    async function handleArchive(post: Post, isArchived: boolean) {
        try {
            await updatePost(post.id, { ...post, archived: isArchived });
            setNotification("Updated archive status successfully!");
            setPosts((prevPosts) =>
                prevPosts.map((p) => (p.id === post.id ? { ...p, archived: isArchived } : p))
            );
            setTimeout(() => setNotification(""), 3000);
        } catch (error) {
            console.error("Failed to update archive status:", error);
            setNotification("Failed to update archive status. Try again.");
            setTimeout(() => setNotification(""), 3000);
        }
    }

    async function handleFeature(post: Post, isFeatured: boolean) {
        try {
            await updatePost(post.id, { ...post, featured: isFeatured });
            setNotification("Updated featured status successfully!");
            setPosts((prevPosts) =>
                prevPosts.map((p) => (p.id === post.id ? { ...p, featured: isFeatured } : p))
            );
            setTimeout(() => setNotification(""), 3000);
        } catch (error) {
            console.error("Failed to update featured status:", error);
            setNotification("Failed to update featured status. Try again.");
            setTimeout(() => setNotification(""), 3000);
        }
    }

    if (posts.length === 0) {
        return <div>Loading posts...</div>;
    }

    return (
        <div>
            {notification && (
                <div className="fixed top-15 mb-8 right-18 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md shadow-lg">
                    {notification}
                </div>
            )}
            <h1 className="text-2xl font-semibold mb-4">Existing Post Titles</h1>
            <ul>
                {posts.map((post) => (
                    <li
                        key={post.id}
                        className="list-none ml-2 pb-3 rounded-lg transition-transform"
                    >
                        <Link
                            href={`/admin/site/blog/${post.id}`}
                            className="text-blue-600 font-medium underline hover:no-underline hover:text-blue-800 cursor-pointer"
                        >
                            {post.featured ? `*${post.title}` : post.title}
                        </Link>
                        <button
                            className="ml-2 mr-2 bg-red-600 hover:bg-red-700 rounded-lg pl-1 pr-1 p-0.5 text-white text-sm"
                            onClick={() => handleDelete(post)}
                        >
                            X
                        </button>
                        <div>
                            <label className="mr-1 text-sm font-medium text-gray-700">Featured</label>
                            <input
                                type="checkbox"
                                name="featured"
                                checked={!!post.featured} // Ensure boolean value
                                className="mt-1 mr-2.5"
                                onChange={(e) => handleFeature(post, e.target.checked)}
                            />
                            <label className="mr-1 text-sm font-medium text-gray-700">Archived</label>
                            <input
                                type="checkbox"
                                name="archived"
                                checked={!!post.archived} // Ensure boolean value
                                className="mt-1"
                                onChange={(e) => handleArchive(post, e.target.checked)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
