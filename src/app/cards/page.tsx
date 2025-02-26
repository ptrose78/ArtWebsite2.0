'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { addToCart } from '../../store/features/cartSlice'; // Path to your cart slice
import { useState, useEffect } from 'react';
import AddToCartButton from '@/app/components/AddToCartButton';
import OrderNowButton from '@/app/components/OrderNowButton';

interface CardItem {
  id: number | string; // Accepts both numbers and strings
  image_url: string;
  price: string;
  title: string;
  size: string;
  description: string;
  featured: boolean;
  type: string;
}

export default function CardGalleryPage() {
  const [cardItems, setCardItems] = useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchCardItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/items?type=cards');
      const result = await response.json();
      if (response.ok) {
        setCardItems(result.items);
      } else {
        alert(`Error fetching card items: ${result.error}`);
      }
    } catch (error) {
      console.error('Error fetching card items:', error);
      alert('An error occurred while fetching card items.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCardItems();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-up');
        }
      });
    }, { threshold: 0.5 });

    const elements = document.querySelectorAll('.image-slide');
    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-center font-semibold text-gray-700 mb-8">Cards Collection</h1>
      
        {isLoading ? (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        ) : cardItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No card items available at the moment.</p> 
        ) :  (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cardItems.map((card) => (
            <div key={card.id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
              <img
                src={card.image_url ?? 'https://placehold.co/200x200'}
                alt={card.title}
                className="w-full h-56 object-cover rounded-lg image-slide"
              />
              <h2 className="text-center text-xl font-medium text-gray-800 mt-4">{card.title}</h2>
              <p className="text-center text-gray-600 font-semibold text-lg mt-2">${parseFloat(card.price).toFixed(2)}</p>
              <p className="text-center text-gray-600 font-semibold text-lg mt-2">{`${card.width} x ${card.length}`}</p>
              <p className="text-center text-gray-500 text-sm mt-2">{card.description}</p>
              <div className="flex justify-center space-x-4 items-center mt-2">
                <AddToCartButton item={card} />
                <OrderNowButton item={card} />
              </div>
            </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
