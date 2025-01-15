'use client';

import { useState } from 'react';
import {
    EditorState,
    ContentState,
    convertToRaw,
    RichUtils,
    convertFromRaw,
} from 'draft-js';
import { createPost, updatePost } from "@/app/lib/data";
import "draft-js/dist/Draft.css"; // Import Draft.js styles
import dynamic from 'next/dynamic';
import Link from 'next/link'

// Dynamically load the Editor component
const Editor = dynamic(() => import('draft-js').then((mod) => mod.Editor), {
    ssr: false,
});

interface Post {
    id?: number;
    title?: string;
    content?: string; // Store content as raw JSON string
    excerpt?: string;
    featured?: boolean;
    archived?: boolean;
}

export default function PostForm({ initialPost }: { initialPost?: Post }) {
    const initialContent = initialPost?.content
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(initialPost.content)))
        : EditorState.createEmpty();

    const [editorState, setEditorState] = useState(initialContent);
    const [post, setPost] = useState<Post>(initialPost || {});
    const [status, setStatus] = useState('');

    const handlePostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.currentTarget;

        if (type === "checkbox") {
            const isChecked = (e.currentTarget as HTMLInputElement).checked;
            setPost((prev) => ({
                ...prev,
                [name]: isChecked,
            }));
        } else {
            setPost((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const toggleBlockType = (blockType: string) => {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("Submitting...");
        let postResponse;

        const contentState = editorState.getCurrentContent();
        const rawContent = JSON.stringify(convertToRaw(contentState));

        try {
            const updatedPost = { ...post, content: rawContent };

            if (post.id) {
                postResponse = await updatePost(post.id, updatedPost);
            } else {
                postResponse = await createPost(updatedPost);
                setPost({ id: 0, title: '', content: '', featured: false });
                setEditorState(EditorState.createEmpty());
            }

            if (postResponse.success) {
                setStatus(postResponse.message);
            }
        } catch (error) {
            console.error("Error adding post:", error);
            setStatus("Failed to post. Please try again.");
        }
    }

    return (
        <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Post Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        onChange={handlePostChange}
                        value={post.title || ""}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Post Excerpt
                    </label>
                    <input
                        type="text"
                        name="excerpt"
                        placeholder="Excerpt"
                        onChange={handlePostChange}
                        value={post.excerpt || ""}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                    <label htmlFor="content" className="block mt-3 text-sm font-medium text-gray-700">
                        Post Content
                    </label>
                    <div className="mt-2 space-x-2">
                        <button
                            type="button"
                            onClick={() => toggleBlockType('header-one')}
                            className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            H1
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleBlockType('header-two')}
                            className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            H2
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleBlockType('header-three')}
                            className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            H3
                        </button>
                    </div>
                    <div
                        className="mt-1 border border-gray-300 rounded-md shadow-sm p-2"
                        style={{
                            minHeight: "300px",
                            maxHeight: "500px",
                            overflow: "auto",
                        }}
                    >
                        <Editor
                            editorState={editorState}
                            onChange={setEditorState}
                            placeholder="Write your post content here..."
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
                >
                    {post.id ? 'Update Post' : 'Create Post'}
                </button>
            </form>
            {status && (
                <div>
                    <p className="mt-4 text-sm text-gray-600">{status}</p>
                    
                </div>
            )}
            {(status && post.id) && (
                <Link href="/admin/blog" className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10.5l7.5-7.5m0 0L18 10.5m-7.5-7.5V21"
                    />
                </svg>
                Return to Main Page
                </Link>
            )}
        </div>
    );
}
