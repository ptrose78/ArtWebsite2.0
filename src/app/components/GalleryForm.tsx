'use client';
import { useState } from "react";

interface GalleryItem {
  id?: string;
  title: string;
  price: string;
  featured: boolean;
  file: File | null;
}

export default function GalleryForm({ existingItem }: { existingItem?: GalleryItem }) {
  const [formData, setFormData] = useState<GalleryItem>({
    title: existingItem?.title || "",
    price: existingItem?.price || "",
    featured: existingItem?.featured || false,
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("file", formData.file as Blob);
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("price", formData.price);
      formDataToSubmit.append("featured", String(formData.featured));

      const response = existingItem
        ? await fetch(`/api/gallery/${existingItem.id}`, {
            method: "PUT",
            body: formDataToSubmit,
          })
        : await fetch(`/api/gallery`, {
            method: "POST",
            body: formDataToSubmit,
          });

      const result = await response.json();

      if (response.ok) {
        alert("Gallery item saved successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving gallery item:", error);
      alert("An error occurred while saving the gallery item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Gallery Item Form</h2>

      <div className="flex flex-col">
        <label htmlFor="title" className="text-sm font-medium text-gray-600">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="price" className="text-sm font-medium text-gray-600">
          Price
        </label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-200 border-gray-300 rounded"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-600">
          Featured
        </label>
      </div>

      <div className="flex flex-col">
        <label htmlFor="file" className="text-sm font-medium text-gray-600">
          Upload Image
        </label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          required
          className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300"
      >
        {isLoading ? "Saving..." : "Save Gallery Item"}
      </button>
    </form>
  );
}
