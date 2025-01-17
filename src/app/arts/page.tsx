'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { addToCart } from '../../store/features/cartSlice'; // Path to your cart slice
import { useState, useEffect } from 'react';

interface GalleryItem {
  id: number | string; // Accepts both numbers and strings
  image_url: string;
  price: string;
  title: string;
  date: string | null;
  featured: boolean
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchGalleryItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery");
      const result = await response.json();
      if (response.ok) {
        setGalleryItems(result.galleryItems);
      } else {
        alert(`Error fetching gallery items: ${result.error}`);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      alert("An error occurred while fetching gallery items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  async function handleAddToCart(art: any) {
      await dispatch(addToCart(art)); // Dispatch action to add to cart
  };

  async function handleOrderNow(art: any) {
    await dispatch(addToCart(art)); // Dispatch action to add to cart
    router.push('/cart'); // Navigate to the cart page after adding the item
};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Art Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {galleryItems.length > 0 ? (
          galleryItems.map((art) => (
            <div key={art.id} className="border rounded-lg p-4">
              <img
                src={art.image_url ?? 'https://placehold.co/200x200'} 
                alt={art.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-xl font-bold mt-2">{art.title}</h2>
              <p className="text-gray-600 font-semibold">${parseFloat(art.price).toFixed(2)}</p>
              
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleAddToCart(art)}
                  className="mt-4 mr-8 text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded"
                >Add To Cart
                </button>
                <button
                  onClick={() => handleOrderNow(art)}
                  className="mt-4 text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p> // Handle loading state
        )}
      </div>
    </div>
  );
}
