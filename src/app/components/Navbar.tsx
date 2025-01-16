import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State to track the menu's open/closed status

  const toggleMenu = () => setIsOpen(!isOpen); // Toggle menu visibility

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      {/* Container for navigation content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-lg font-bold text-gray-700">
              MyLogo
            </Link>
          </div>

          {/* Hamburger Icon */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 focus:outline-none"
            aria-label="Toggle navigation"
          >
            <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
          </button>

          {/* Regular navigation for larger screens */}
          <ul className="hidden lg:flex space-x-6 text-sm sm:text-base">
            <li>
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-gray-900">
                About
              </Link>
            </li>
            <li>
              <Link href="/arts" className="text-gray-700 hover:text-gray-900">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900">
                Blogs
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Slide-out menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 w-2/4 h-full bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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

        <ul className="flex flex-col items-center space-y-4 mt-20">
          <li>
            <Link href="/" className="text-gray-300 hover:text-gray-100" onClick={toggleMenu}>
              Home
            </Link>
          </li>
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
    </nav>
  );
}
