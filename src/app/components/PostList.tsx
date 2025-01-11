'use client';

import { deletePost } from "@/app/lib/data";
import { updatePost } from "@/app/lib/data";
import Link from 'next/link';

interface Post {
    id?: number;
    title?: string;
    content?: string; // Store content as raw JSON string
    featured?: boolean;
}

export default function PostList({ posts }) {

    async function handleDelete(post) {
        try {
            await deletePost(post);
            alert(`Post "${post.title}" deleted successfully.`);
            // Optionally, refresh the page or state
            window.location.reload(); // Refresh the page after deletion
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert("An error occurred while deleting the post.");
        }
    }

    async function handleArchive(post, isArchived) {
        try {
            await updatePost(post.id, {...post, archived: isArchived})
            alert(`Post "${post.title}" ${isArchived ? 'archived' : 'unarchived'} successfully`)
        } catch(error) {
            console.error("Database error:", error);
            throw new Error("Failed to update the post's archive status.")
        }
    }

    async function handleFeature(post, isFeatured) {
        try {
            updatePost(post.id, {...post, featured: isFeatured})
        } catch(error) {
            console.error("Database error:", error);
            throw new Error("Failed to update the post's feature status")
        }
    }

    return (
        <div>
            {posts.map((post) => (
                <li
                    key={post.id}
                    className="list-none ml-2 pb-3 rounded-lg transition-transform"
                >
                    <Link
                        href={`/admin/blog/${post.id}`}
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
                            name="archived"
                            checked={post.featured}
                            className="mt-1 mr-2.5"
                            onChange={(e) => handleFeature(post, e.target.checked)}
                        />
                        <label className="mr-1 text-sm font-medium text-gray-700">Archived</label>
                        <input
                            type="checkbox"
                            name="archived"
                            checked={post.archived}
                            className="mt-1"
                            onChange={(e) => handleArchive(post, e.target.checked)}
                        />
                    </div>
                </li>
            ))}
        </div>
    );
}
