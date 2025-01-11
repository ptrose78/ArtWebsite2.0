import PostForm from "@/app/components/PostForm";
import PostSection from "@/app/components/PostSection";

export default function BlogAdminPage() {
    return (
        <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
            <div className="grid grid-cols-7 gap-1">
                <div className="col-span-5">
                    <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
                    <PostForm />
                </div>
                <div className="col-span-2">
                    <PostSection />
                </div>
            </div>
        </div>
    );
}
