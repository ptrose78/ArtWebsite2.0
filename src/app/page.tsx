'use client'
import Layout from "@/app/layout";
import Link from 'next/link';
import Image from 'next/image';
import { fetchArts, addCustomers } from '@/app/lib/data'
import { useEffect, useState } from 'react';

interface Art {
  id: number | string; // Accepts both numbers and strings
  image_url: string;
  price: string;
  title: string;
  date: string | null;
  featured: string;
}

export default function Home() {
  const [arts, setArts] = useState<Art[]>([]); 
  const [email, setEmail] = useState('');
  const [successSubmit, setSuccessSubmit] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index
  const [animationKey, setAnimationKey] = useState(0);

   // Sample slide images (replace with dynamic images from `arts` if needed)

   const slides = [
    {
      mainImage: 'https://firebasestorage.googleapis.com/v0/b/artwebsite-eebdb.firebasestorage.app/o/IMG_2334.jpg?alt=media&token=4da842f3-d12b-4540-bfc9-49b09d08da88',
      backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/artwebsite-eebdb.firebasestorage.app/o/Gemini_Generated_Image_vp8fjyvp8fjyvp8f.jfif?alt=media&token=07d83a9e-c53b-46a8-8471-9ab29cca88d7',
    },
    {
      mainImage: 'https://firebasestorage.googleapis.com/v0/b/artwebsite-eebdb.firebasestorage.app/o/IMG_2332.jpg?alt=media&token=a434ee96-6a68-4a6b-a641-25ccc09bf2b3',
      backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/artwebsite-eebdb.firebasestorage.app/o/Gemini_Generated_Image_c8p1g0c8p1g0c8p1.jfif?alt=media&token=e2254ad1-f836-4f46-820a-b51bf50e305a'
    },
    {
      mainImage: 'https://firebasestorage.googleapis.com/v0/b/artwebsite-eebdb.firebasestorage.app/o/IMG_2333.jpg?alt=media&token=8f10c9dc-51c4-4c5a-99ee-006c8b3607f8',
      backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/artwebsite-eebdb.firebasestorage.app/o/Gemini_Generated_Image_c8p1g0c8p1g0c8p1.jfif?alt=media&token=e2254ad1-f836-4f46-820a-b51bf50e305a',
    },
  ];
   
  // Automatically change slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setAnimationKey((prev) => prev + 1);
    }, 3000); // 5 seconds per slide

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [slides.length]);

  useEffect(() => {
    // Define the async function inside the useEffect
        const getArts = async (): Promise<Art[]> => {
            const response = await fetchArts();
            
            return response.map((item) => ({
              id: item.id ?? 0, // Default to 0 if id is null/undefined
              image_url: item.image_url ?? 'https://placehold.co/200x200',
              price: item.price ?? '',
              title: item.title ?? '',
              date: item.date,
              featured: item.featured
            }));
          }

    // Call the async function and set the state with the resolved data
    const fetchData = async () => {
      const artData = await getArts();  // Await the Promise to get the resolved data
      setArts(artData);  // Now set the arts state with the resolved data
    };

    fetchData(); // Call the fetchData function inside useEffect
  }, []); // Empty dependency array means this runs only once when the component mounts

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await addCustomers(email);
    if (response.success) {
      setSuccessSubmit(true)
    }
  }

  return (
      <div>  
         <section className="relative w-full h-[450px] sm:h-[500px] lg:h-[650px] overflow-hidden">
      {/* Slideshow */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((image, index) => (
          <div
            key={`${index}-${animationKey}`} // Unique key ensures re-render
            className={`absolute inset-0 z-10 fade-slide ${
              index === currentSlide ? 'block' : 'hidden'
            }`}
            style={{
              animation: index === currentSlide ? 'fadeInMove 1s ease-out' : '',
            }}
          >
            {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
            style={{
              backgroundImage: `url(${image.backgroundImage})`, // Use slide-specific background image
              backgroundSize: 'cover',
              backgroundPosition: '5% 55%'
            }}
          ></div>

            {/* Main Slide Image */}
            <img
              src={image.mainImage}
              alt={`Slide ${index}`}
              className="absolute object-contain"
              style={{
                width: 'auto', // Maintain aspect ratio
                height: `clamp(67%, 72%, ${window.innerWidth / 2}px)`, // Dynamically adjust height
                top: '10%', // Move the image 10% down from the top
                left: '45%', // Move the image 20% from the left
                transform: 'translate(-20%, -10%)', // Adjust for the shifted position
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-20"></div>

      {/* Text Content */}
      <div className="absolute inset-0 z-30 flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          Woodlands Design
        </h1>
        <p className="sm:text-lg mb-8">Discover Unique Art for Your Space</p>
        <a
          href="/arts"
          className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600 text-sm sm:text-base"
        >
          Explore Our Collection
        </a>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setAnimationKey((prev) => prev + 1); // Trigger animation
            }}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-teal-500' : 'bg-gray-400'
            }`}
          ></button>
        ))}
      </div>
    </section>

      {/* Featured Artworks Section */}
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-8">
          Featured Artworks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Artwork Card */}
          {arts.map((art) => 
            art.featured === "true" ? (
            <div
              key={art.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={art.image_url || 'https://placehold.co/200x200' }
                alt={`Artwork ${art}`}
                width={500}
                height={500}
                className="w-full h-48 sm:h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold">
                  {art.title}     
                </h3>
                <p className="text-gray-600 font-semibold">{`$${art.price}`}</p>
              </div>
            </div>
            ) : null
          )}
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
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded-lg text-black w-full sm:w-1/2 lg:w-1/3"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-teal-600 py-2 px-6 rounded-lg hover:bg-teal-700"
          >
            Join Now
          </button>
        </form>
        {successSubmit && <p className="mt-5 text-white">You have been added to our email list!</p>}
      </section>
      </div>
  );
}
