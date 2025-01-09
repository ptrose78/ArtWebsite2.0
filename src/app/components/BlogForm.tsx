'use client';
import PreviousMap_ from 'postcss/lib/previous-map';
import { useState } from 'react';
import { string } from 'square/dist/types/schema';
import { addBlog } from "@/app/lib/data";

export default function BlogForm() {

    const[blog, setBlog] = useState({
        title: '',
        content: '',
        date: ''
    });

    const[status, setStatus] = useState('');

    function formDataToObject(formData: FormData){
        const obj: Record<string, any> = {};
        formData.forEach((value, key)=>{
            obj[key]=value;
        })
        return obj;
    }

    function handleBlogChange(e) {
        const {name, value} = e.currentTarget;
        setBlog((prev)=>({...prev, 
            [name]: value
        }))
    }

    async function handleSubmit(e) {
        
        e.preventDefault();
        setStatus("Submitting...");

        try {
            const formData = new FormData(e.currentTarget);
            const blog = formDataToObject(formData);
            const blogResponse = await addBlog(blog);

            if (blogResponse.success) {
                setStatus(blogResponse.message);
            }
            setBlog({title:'', content:'', date:''})
        } catch(error) {
            console.error("Error adding blog:", error);
            setStatus("Failed to post blog. Please try again.")
        }
    }

    return(
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Create New Blog</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Blog Title
                </label>
                <input 
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={handleBlogChange}
                    value={blog.title}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
                </div>
                <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Blog Content
                </label>
                <textarea 
                    id="content"
                    name="content"
                    placeholder="Write your blog content here..."
                    value={blog.content}
                    onChange={handleBlogChange}
                    rows="6"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
                </div>
                <button 
                type="submit"
                className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600">
                    Post Blog
                </button>
            </form>
            {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
        </div>
    )
}