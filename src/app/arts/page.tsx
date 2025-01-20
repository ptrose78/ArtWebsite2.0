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
  featured: boolean;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchGalleryItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gallery');
      const result = await response.json();
      if (response.ok) {
        setGalleryItems(result.galleryItems);
      } else {
        alert(`Error fetching gallery items: ${result.error}`);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      alert('An error occurred while fetching gallery items.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Create an observer to trigger the slide-up animation when elements enter the viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-up');
        }
      });
    }, { threshold: 0.5 }); // Trigger when 50% of the element is in view

    const elements = document.querySelectorAll('.image-slide');
    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      // Clean up the observer
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  async function handleAddToCart(art: any) {
    await dispatch(addToCart(art)); // Dispatch action to add to cart
  }

  async function handleOrderNow(art: any) {
    await dispatch(addToCart(art)); // Dispatch action to add to cart
    router.push('/cart'); // Navigate to the cart page after adding the item
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-center font-semibold text-gray-700 mb-8">Art Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {galleryItems.length > 0 ? (
          galleryItems.map((art) => (
            <div key={art.id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
              <img
                src={art.image_url ?? 'https://placehold.co/200x200'}
                alt={art.title}
                className="w-full h-56 object-cover rounded-lg slide-up"
              />
              <h2 className="text-xl font-medium text-gray-800 mt-4">{art.title}</h2>
              <p className="text-gray-600 font-semibold text-lg mt-2">${parseFloat(art.price).toFixed(2)}</p>

              <div className="flex justify-center space-x-4 items-center mt-6">
                <button
                  className="text-white bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-full text-sm font-medium transition-all"
                  onClick={() => {
                    handleAddToCart(art);
                  }}
                >
                  Add To Cart
                </button>
                <button
                  className="text-white bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-full text-sm font-medium transition-all"
                  onClick={() => {
                    handleOrderNow(art);
                  }}
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
