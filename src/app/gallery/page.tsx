'use client';

import { useState, useEffect } from 'react';
import AddToCartButton from '@/app/components/AddToCartButton';
import OrderNowButton from '@/app/components/OrderNowButton';

interface GalleryItem {
  id: number | string; // Accepts both numbers and strings
  image_url: string;
  price: string;
  title: string;
  width: string;
  length: string;
  date: string | null;
  featured: boolean;
  type: string;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGalleryItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/items?type=gallery');
      const result = await response.json();
      if (response.ok) {
        setGalleryItems(result.items);
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-center font-semibold text-gray-700 mb-8">Art Gallery</h1>
  
      {isLoading ? (
        <p className="text-center text-gray-600 text-lg">Loading...</p> // Show loading state
      ) : galleryItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No gallery items available at the moment.</p> // Handle empty state
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {galleryItems.map((art) => (
            <div
              key={art.id}
              className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <img
                src={art.image_url ?? 'https://placehold.co/200x200'}
                alt={art.title}
                className="w-full h-56 object-cover rounded-lg image-slide"
              />
              <h2 className="text-center text-xl font-medium text-gray-800 mt-4">{art.title}</h2>
              <p className="text-center text-gray-600 font-semibold text-lg mt-2">
                ${parseFloat(art.price).toFixed(2)}
              </p>
              <p className="text-center text-gray-600 font-semibold text-lg mt-2">{`${art.width} x ${art.length}`}</p>
              <div className="flex justify-center space-x-4 items-center mt-2">
                <AddToCartButton item={art} />
                <OrderNowButton item={art} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  