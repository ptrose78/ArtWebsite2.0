// pages/index.tsx
import Layout from "@/app/layout";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    
      <div>
       {/* Hero Section */}
       <section
        className="relative bg-cover bg-center h-[400px] sm:h-[500px] lg:h-[600px]"
        style={{ backgroundImage: 'url(/hero-image.jpg)' }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10 py-16 sm:py-20 lg:py-32">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Discover Unique Art for Your Space
          </h1>
          <p className="text-sm sm:text-lg mb-8">
            Handcrafted, original art pieces created by local artists.
          </p>
          <a
            href="/shop"
            className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600 text-sm sm:text-base"
          >
            Explore Our Collection
          </a>
        </div>
      </section>
      {/* Featured Artworks Section */}
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-8">
          Featured Artworks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Artwork Card */}
          {[1, 2, 3, 4, 5, 6].map((art) => (
            <div
              key={art}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <Image
                src={`/art${art}.jpg`}
                alt={`Artwork ${art}`}
                width={500}
                height={500}
                className="w-full h-48 sm:h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Artwork Title {art}
                </h3>
                <p className="text-gray-600">$500</p>
                <a href={`/art/${art}`} className="text-teal-500 hover:underline text-sm">
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-8">
            What Our Customers Say
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <p>"This painting brought a new energy to my living room!" - Sarah, NY</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <p>"I love how unique and personal each piece is." - Mark, LA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-teal-500 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4">
          Join Our Art Community
        </h2>
        <p className="text-sm sm:text-lg mb-6">
          Sign up for exclusive offers and new art arrivals!
        </p>
        <form className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded-lg text-black w-full sm:w-1/2 lg:w-1/3"
          />
          <button
            type="submit"
            className="bg-teal-600 py-2 px-6 rounded-lg hover:bg-teal-700"
          >
            Join Now
          </button>
        </form>
      </section>
      </div>
  );
}
