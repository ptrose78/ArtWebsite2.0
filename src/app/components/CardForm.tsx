'use client';
import { useState } from "react";
import { useAddCardItemMutation, useUpdateCardItemMutation } from "../../store/features/apiSlice";

interface CardItem {
  id?: string;
  title: string;
  price: string;
  width: string;
  length: string;
  featured: boolean;
  file: File | null;
  type: string;
}

export default function CardForm({ existingItem }: { existingItem?: CardItem }) {
  const [formData, setFormData] = useState<CardItem>({
    title: existingItem?.title || "",
    price: existingItem?.price || "",
    width: existingItem?.width || "",
    length: existingItem?.length || "",
    featured: existingItem?.featured || false,
    file: null,
    type: "cards",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [addCardItem] = useAddCardItemMutation();
  const [updateCardItem] = useUpdateCardItemMutation();

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
    console.log("Form data:", formData);
    setIsLoading(true);
  
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("file", formData.file as Blob);
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("price", formData.price);
      formDataToSubmit.append("width", formData.width);
      formDataToSubmit.append("length", formData.length);
      formDataToSubmit.append("featured", String(formData.featured));
      formDataToSubmit.append("type", "cards");
  
      const result = existingItem
        ? await updateCardItem({ id: existingItem.id, ...formDataToSubmit })
        : await addCardItem(formDataToSubmit);
  
        console.log("result",result)
      if ("error" in result) {
        alert(`Error: ${result.error}`);
      } else {
        alert("Card item saved successfully!");
      }
    } catch (error) {
      console.error("Error saving card item:", error);
      alert("An error occurred while saving the card item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Create Card Item</h2>

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

      <div className="flex flex-col">
        <label htmlFor="width" className="text-sm font-medium text-gray-600">
          Width
        </label>
        <input
          type="text"
          id="width"
          name="width"
          value={formData.width}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="length" className="text-sm font-medium text-gray-600">
          Length
        </label>
        <input
          type="text"
          id="length"
          name="length"
          value={formData.length}
          onChange={handleChange}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
        />
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
        {isLoading ? "Saving..." : "Save Card Item"}
      </button>
    </form>
  );
}
