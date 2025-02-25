'use client';
import { useEffect, useState } from "react";

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
  const [cardItems, setCardItems] = useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CardItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchCardItems = async () => {
    setIsLoading(true);
    console.log("fetchCardItems")
    try {
      const response = await fetch("/api/items?type=cards");
      const result = await response.json();
      console.log("result", result)
      if (response.ok) {
        console.log("response.ok", response.ok)
        console.log("result.cardItems", result.items)
        setCardItems(result.items ?? []);
      } else {
        alert(`Error fetching card items: ${result.error}`);
      }
    } catch (error) {
      console.error("Error fetching cards items:", error);
      alert("An error occurred while fetching card items.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (item: CardItem) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      try {
        const response = await fetch("/api/items", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: [item] }), 
        });

        const result = await response.json();
        if (response.ok) {
          alert("Card item deleted successfully!");
          setCardItems(cardItems.filter(cardItem => cardItem.id !== item.id)); 
        } else {
          alert(`Error deleting card item: ${result.error}`);
        }
      } catch (error) {
        console.error("Error deleting card item:", error);
        alert("An error occurred while deleting the card item.");
      }
    }
  };

  const handleEdit = (item: CardItem) => {
    setEditingItem({ ...item });
    setSelectedFile(null); // Reset the file input
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
    if (!editingItem) return;

    let updatedImageUrl = editingItem.image_url;

    // If a new file is selected, upload it to Firebase Storage
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("id", editingItem.id);
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

    try {
      const updatedItem = { ...editingItem, image_url: updatedImageUrl };
      console.log(updatedItem)
      const response = await fetch("/api/items", {
        method: "PUT",
        body: JSON.stringify(updatedItem),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.ok) {
        alert("Card item updated successfully!");
        setCardItems((prevItems) =>
          prevItems.map((item) => (item.id === editingItem.id ? updatedItem : item))
        );
        setEditingItem(null);
        setSelectedFile(null);
      } else {
        alert(`Error updating card item: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating card item:", error);
      alert("An error occurred while updating the card item.");
    }
  };

  useEffect(() => {
    fetchCardItems();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cards Items</h2>
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : cardItems.length > 0 ? (
        <ul className="space-y-4">
          {cardItems.map((item) => (
            <li key={item.id} className="p-4 bg-white rounded-lg shadow-md">
              {editingItem?.id === item.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Title:</label>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, title: e.target.value })
                      }
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Price:</label>
                    <input
                      type="text"
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, price: e.target.value })
                      }
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Width:</label>
                    <input
                      type="text"
                      value={editingItem.width}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, width: e.target.value })
                      }
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Length:</label>
                    <input
                      type="text"
                      value={editingItem.length}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, length: e.target.value })
                      }
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingItem.featured}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, featured: e.target.checked })
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
                <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4"> {/* Centering and flex-col/row */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 text-center sm:text-left"> {/* Text alignment */}
                    <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.price}</p>
                    <p className="text-sm text-gray-600">{item.width} x {item.length}</p>
                    <p
                      className={`text-sm ${
                        item.featured ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.featured ? "Featured" : "Not Featured"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2"> {/* Buttons container - always horizontal */}
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
      ) : (
        <p className="text-gray-600">No gallery items found.</p>
      )}
    </div>
  );
}
