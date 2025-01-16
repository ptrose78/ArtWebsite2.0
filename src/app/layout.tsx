'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { Provider } from 'react-redux';
import { store } from '../store/store'; // Path to your Redux store
import Head from 'next/head';
import Script from 'next/script';
// import CartIcon from '@/app/components/CartIcon';
import { fetchMisc } from '@/app/lib/data';
import Navbar from "@/app/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "Woodlands Design",
  description: "Woodlands Design, Art Painting Business",
};


export default function Layout({ children }: { children: ReactNode }) {
  const [squareLoaded, setSquareLoaded] = useState(false);
  const [logo, setLogo] = useState<string|null>("");

  useEffect(() => {
    if (squareLoaded) {
      // Only initialize Square once SDK is fully loaded
      const initializeSquare = async () => {
        console.log('Square SDK script loaded.');
        if (window.Square) {
          // You can initialize your Square logic here (payment form, etc.)
        }
      };
      initializeSquare();
    }

    async function getLogo() {
      try {
        const misc = await fetchMisc(); // Fetch the data
        console.log('Misc data:', misc);
    
        if (!Array.isArray(misc)) {
          throw new Error('Expected misc to be an array');
        }
    
        const logo = misc.find(item => item.description === "logo");
        
        if (logo?.image_url) {
          setLogo(logo.image_url); // Assuming you want to store the URL
        } else {
          console.error("Logo or image_url is undefined");
        }
      } catch (error) {
        console.error('Error in get Logo:', error.message);
      }
    }
    getLogo();
  
  }, [squareLoaded]);  

  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Head>
            <title>Art Business</title>
            <meta name="description" content={metadata.description ?? 'Woodlands Design, Art Painting Business'} />
          </Head>

          <header className="bg-white py-4">
            <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
              <div className="logo">
                <Link href="/" className="text-lg sm:text-2xl font-bold text-gray-700">
                  <img src={logo ?? 'https://placehold.co/50x50'} alt="Logo" className="rounded" style={{ width: '50px', height: 'auto' }} />
                </Link>
              </div>
              <div className="nav-container ml-2 justify-between items-center">
                <div className="flex">
                  {/* <Link href="/cart" className="ml-auto">
                    <CartIcon />
                  </Link> */}
                </div>
                <Navbar/>
              </div>
            </div>
          </header>

          <main className="w-full mx-auto py-2">
            {children}
          </main>

          <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
              <div className="text-center sm:text-left">
                <p>&copy; 2024 ArtBusiness</p>
                <p>123 Art St, City, Country</p>
                <p>contact@artbusiness.com</p>
              </div>
              <div className="mt-4 sm:mt-0 space-x-6">
                <a href="#" className="hover:text-teal-500">Instagram</a>
                <a href="#" className="hover:text-teal-500">Facebook</a>
                <a href="#" className="hover:text-teal-500">Pinterest</a>
              </div>
            </div>
          </footer>
           {/* Add the Square SDK script and handle its load event */}
           <Script
            src="https://sandbox.web.squarecdn.com/v1/square.js"
            strategy="beforeInteractive"
            onLoad={() => setSquareLoaded(true)} // Mark Square as loaded once the script loads
            onError={(e) => console.error('Failed to load Square SDK:', e)}
          />
        </body>
      </html>
    </Provider>
  );
}