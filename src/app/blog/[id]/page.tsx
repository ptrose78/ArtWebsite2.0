import { fetchPostById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import PostContent from "@/app/components/PostContent";

export default async function PostPage({ params }: { params: { id: string } }) {
    const post = await fetchPostById(Number(params.id));

    if (!post) {
        notFound();
    }

    return (
        <>
            <PostContent title={post.title} content={post.content} />
        </>
    );
}
