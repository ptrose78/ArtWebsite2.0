'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { addToCart, calculateTotalPrice } from '../../store/features/cartSlice'; // Path to your cart slice
import { useState, useEffect } from 'react';
import { fetchArts } from '@/app/lib/data'; // Assuming this is a client-side data fetching function

export default function GalleryPage() {
  const [arts, setArts] = useState<any[]>([]); // Store fetched art data
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const getArts = async () => {
      const data = await fetchArts(); // Fetch the arts data
      setArts(data); // Set the arts data into state
    };

    getArts(); // Call the function to fetch the data
  }, []); // Empty dependency array means this runs only once when the component mounts

  async function handleAddToCart(art: any) {
      await dispatch(addToCart(art)); // Dispatch action to add to cart
      router.push('/cart'); // Navigate to the cart page after adding the item
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Art Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {arts.length > 0 ? (
          arts.map((art) => (
            <div key={art.id} className="border rounded-lg p-4">
              <img
                src={art.image_url || '/placeholder.jpg'} // Fallback image
                alt={art.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-xl font-bold mt-2">{art.name}</h2>
              <p className="text-gray-600">Price: ${art.price}</p>
              <button
                onClick={() => handleAddToCart(art)}
                className="mt-4 text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded"
              >
                Order Now
              </button>
            </div>
          ))
        ) : (
          <p>Loading...</p> // Handle loading state
        )}
      </div>
    </div>
  );
}
