'use client';
import { useState } from "react";
import { useGetCardItemsQuery, useDeleteCardItemMutation, useUpdateCardItemMutation, useAddCardItemMutation } from '../../store/features/apiSlice';

interface CardItem {
  id: string;
  title: string;
  price: string;
  width: string;
  length: string;
  featured: boolean;
  image_url: string;
  type: string;
}

export default function CardList() {
  const [editingItem, setEditingItem] = useState<CardItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data = [], isLoading } = useGetCardItemsQuery({});
  const cardItems = data.items || [];
  const [deleteCardItem] = useDeleteCardItemMutation();
  const [updateCardItem] = useUpdateCardItemMutation();
  const [addCardItem] = useAddCardItemMutation();

  const handleDelete = async (item: CardItem) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      try {
        const response = await deleteCardItem([item]);  

        if (response.error) {
          alert(`Error deleting card item: ${response.error}`);
        } else {
          alert("Card item deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting card item:", error);
        alert("An error occurred while deleting the card item.");
      }
    }
  };

  const handleEdit = (item: CardItem) => {
    setEditingItem({ ...item });
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return; // If there's no item being edited, exit early.
  
    let updatedImageUrl = editingItem.image_url;
  
    // If a new file is selected, upload it to the Firebase server 
    if (selectedFile) {
      const formData = new FormData();
      formData.append("id", editingItem.id);
      formData.append("file", selectedFile);
      formData.append("type", "cards");
  
      try {
        const uploadResponse = await fetch("/api/items/upload", {
          method: "POST",
          body: formData,
        });
        const uploadResult = await uploadResponse.json();
        if (uploadResponse.ok) {
          updatedImageUrl = uploadResult.image_url;
        } else {
          alert(`Error uploading new image: ${uploadResult.error}`);
          return;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image.");
        return;
      }
    }  
  
    // Prepare the item data with the updated image URL
    console.log("updatedImageUrl:", updatedImageUrl);
    const updatedItem = { ...editingItem, image_url: updatedImageUrl };
  
    try {
      // If an item is being edited (i.e., it has an ID), update it with PUT
      if (editingItem.id) {
        console.log("Updating item:", updatedItem);
        const response = await updateCardItem(updatedItem);
        if (response.error) {
          alert(`Error updating card item: ${response.error}`);
        } else {
          alert("Card item updated successfully!");
         
          setEditingItem(null);
          setSelectedFile(null);
        }
      } else {
        // If no ID is present (i.e., new item), use the add mutation with POST
        const response = await addCardItem(updatedItem); 
        if (response.error) {
          alert(`Error adding card item: ${response.error}`);
        } else {
          alert("Card item added successfully!");
          
          setEditingItem(null);
          setSelectedFile(null);
        }
      }
    } catch (error) {
      console.error("Error saving card item:", error);
      alert("An error occurred while saving the card item.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cards Items</h2>
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : cardItems.length === 0 ? (
        <p className="text-gray-600">No cards items found.</p>
      ) : (
        <ul className="space-y-4">
          {cardItems.map((item) => (
            <li key={item.id} className="p-4 bg-white rounded-lg shadow-md">
              {editingItem?.id === item.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Title:</label>
                    <input
                      type="text"
                      value={editingItem?.title}
                      onChange={(e) =>
                        setEditingItem(editingItem
                          ? { ...editingItem, title: e.target.value }
                          : null)
                      }
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Price:</label>
                    <input
                      type="text"
                      value={editingItem?.price}
                      onChange={(e) =>
                        setEditingItem(editingItem
                          ? { ...editingItem, price: e.target.value }
                          : null)
                      }
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Width:</label>
                    <input
                      type="text"
                      value={editingItem?.width}
                      onChange={(e) =>
                        setEditingItem(editingItem
                          ? { ...editingItem, width: e.target.value }
                          : null)
                      }
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Length:</label>
                    <input
                      type="text"
                      value={editingItem?.length}
                      onChange={(e) =>
                        setEditingItem(editingItem
                          ? { ...editingItem, length: e.target.value }
                          : null)
                      }
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>
  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingItem?.featured}
                      onChange={(e) =>
                        setEditingItem(editingItem
                          ? { ...editingItem, featured: e.target.checked }
                          : null)
                      } 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-600">Featured</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Upload New Image:</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Centering and flex-col/row */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    {/* Text alignment */}
                    <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.price}</p>
                    <p className="text-sm text-gray-600">
                      {item.width} x {item.length}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Buttons container - always horizontal */}
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}