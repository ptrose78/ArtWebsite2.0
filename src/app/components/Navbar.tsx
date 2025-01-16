import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartIcon from '@/app/components/CartIcon';
import { fetchMisc } from '@/app/lib/data';

export default function Navbar() {
  const [logo, setLogo] = useState<string>('');

  useEffect(() => {
    async function getLogo() {
      try {
        const misc = await fetchMisc(); // Fetch the data
        console.log('Misc data:', misc);

        if (!Array.isArray(misc)) {
          throw new Error('Expected misc to be an array');
        }

        const logoItem = misc.find((item) => item.description === 'logo');
        if (logoItem?.image_url) {
          setLogo(logoItem.image_url);
        } else {
          console.error('Logo or image_url is undefined');
        }
      } catch (error) {
        console.error('Error in get Logo:', error.message);
      }
    }
    getLogo();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Logo and Cart */}
          <div className="flex items-center justify-between h-20">
            {/* Shopping Cart Icon - Upper-right */}
            <div className="absolute top-4 right-4">
              <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
                <CartIcon />
              </Link>
            </div>

            {/* Logo - Centered */}
            <div className="flex justify-center w-full">
              <Link href="/" className="text-lg sm:text-2xl font-bold text-gray-700">
                <img
                  src={logo ?? 'https://placehold.co/50x50'}
                  alt="Logo"
                  className="rounded"
                  style={{ width: '100px', height: 'auto' }}
                />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center space-x-6 text-sm sm:text-base mt-4 mb-2">
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="/arts" className="text-gray-700 hover:text-gray-900">
              Gallery
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900">
              Blogs
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mt-32">
        {/* Ensures content starts below the navigation */}
        <main>
          
        </main>
      </div>
    </>
  );
}
