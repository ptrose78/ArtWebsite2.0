import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useSelector } from 'react-redux';
import { selectCart } from '../../store/features/cartSlice';
import { fetchMisc } from '@/app/lib/data';

export default function Navbar() {
  const [logo, setLogo] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false); // State to track menu visibility
  const cart = useSelector(selectCart);

  useEffect(() => {
    async function getLogo() {
      try {
        const misc = await fetchMisc(); // Fetch the data
        const logoItem = misc.find((item) => item.description === 'logo');
        if (logoItem?.image_url) {
          setLogo(logoItem.image_url);
        }
      } catch (error) {
        console.error('Error fetching logo:', error.message);
      }
    }
    getLogo();
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Logo and Cart */}
          <div className="flex items-center justify-between h-20">
            {/* Hamburger Icon - Left */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 focus:outline-none"
              aria-label="Toggle navigation"
            >
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700"></span>
            </button>

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

            {/* Shopping Cart Icon - Upper-right */}
            <div className="absolute top-4 right-4">
              <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
                <div className="flex items-center">
                  <div className="text-sm font-semibold">${cart.totalPrice}</div>
                  <ShoppingCartIcon className="w-5 h-5 text-teal-500 ml-1" />
                </div>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex justify-center space-x-6 text-sm sm:text-base mt-4 mb-2">
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

      {/* Slide-in Menu for Mobile */}
      <div
        className={`fixed top-0 left-0 w-1/4 h-full bg-gray-800 text-white transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-50`}
      >
        {/* Close Button */}
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 focus:outline-none"
          aria-label="Close navigation"
        >
          <span className="text-2xl font-bold">&times;</span>
        </button>

        {/* Menu Items */}
        <ul className="flex flex-col items-start space-y-4 mt-16 px-6">
          <li>
            <Link href="/about" className="text-gray-300 hover:text-gray-100" onClick={toggleMenu}>
              About
            </Link>
          </li>
          <li>
            <Link href="/arts" className="text-gray-300 hover:text-gray-100" onClick={toggleMenu}>
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-gray-300 hover:text-gray-100" onClick={toggleMenu}>
              Blogs
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-300 hover:text-gray-100" onClick={toggleMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="mt-32">
        <main>{/* Ensures content starts below the navigation */}</main>
      </div>
    </>
  );
}
