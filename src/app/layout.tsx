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
  
  }, [squareLoaded]);  

  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Head>
            <title>Art Business</title>
            <meta name="description" content={metadata.description ?? 'Woodlands Design, Art Painting Business'} />
          </Head>

          <header className="bg-white">
            <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
              <div className="nav-container ml-2 justify-between items-center">
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
                <p>&copy; 2025 Woodland Designs</p>
                <p>door2murrin@msn.com</p>
                <p>630-946-6785</p>
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