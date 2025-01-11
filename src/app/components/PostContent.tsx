"use client";

import { EditorState, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import dynamic from "next/dynamic";

// Dynamically import the Editor component
const Editor = dynamic(
    () => import("draft-js").then((mod) => mod.Editor),
    { ssr: false }
);

interface PostContentProps {
    title: string;
    content: string;
}

export default function PostContent({ title, content }: PostContentProps) {
    // Deserialize the content
    const contentState = content ? convertFromRaw(JSON.parse(content)) : null;
    const editorState = contentState ? EditorState.createWithContent(contentState) : EditorState.createEmpty();

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            {/* Post Title */}
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">{title}</h2>

            {/* Post Content */}
            <div className="border p-4 bg-white shadow-sm rounded-md">
                <Editor editorState={editorState} readOnly={true} onChange={() => {}} />
            </div>
        </div>
    );
}
