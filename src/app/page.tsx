'use client'
import Layout from "@/app/layout";
import Link from 'next/link';
import Image from 'next/image';
import { fetchArts, addSubscribers } from '@/app/lib/data'
import { useEffect, useState, useRef, FormEvent  } from 'react';
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
  featured: string;
}

function formDataToObject(formData: FormData) {
  const obj: Record<string, any> = {};
  formData.forEach((value, key) => {
      obj[key] = value;
  });
  return obj;
}

export default function Home() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [successSubmit, setSuccessSubmit] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index
  const [animationKey, setAnimationKey] = useState(0);
  const [dynamicHeight, setDynamicHeight] = useState("72%");
  const [imagePosition, setImagePosition] = useState({
    top: "14%", // Initial position for larger screens
    left: "55%", // Initial position for larger screens
    transform: "translate(-50%, -10%)", // Initial position for larger screens
  });

  const [inView, setInView] = useState(false); // Track if the section is in view
  const sectionRef = useRef(null); // Reference for Featured Artworks section

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

  const fetchGalleryItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery");
      const result = await response.json();
      if (response.ok) {
        setGalleryItems(result.galleryItems);
      } else {
        alert(`Error fetching gallery items: ${result.error}`);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      alert("An error occurred while fetching gallery items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 665) {  // For smaller screens
        setImagePosition({
          top: "18%",  // Move the image 10% from the top
          left: "55%", // Center the image horizontally
          transform: "translate(-50%, -10%)", // Adjust for more consistent centering
        });
      } else if (window.innerWidth <= 768) {  // For smaller screens
        setImagePosition({
          top: "12%",  // Move the image 10% from the top
          left: "55%", // Center the image horizontally
          transform: "translate(-50%, -10%)", // Adjust for more consistent centering
        });
      } else if (window.innerWidth <= 1024) {  // For smaller screens
        setImagePosition({
          top: "10%",  // Move the image 10% from the top
          left: "55%", // Center the image horizontally
          transform: "translate(-50%, -10%)", // Adjust for more consistent centering
        });
      } else if (window.innerWidth <= 1220) {  // For smaller screens
        setImagePosition({
          top: "8%",  // Move the image 10% from the top
          left: "55%", // Center the image horizontally
          transform: "translate(-50%, -10%)", // Adjust for more consistent centering
        });
      }
       else {  // For larger screens
        setImagePosition({
          top: "15%", // Move the image 14% from the top
          left: "55%", // Move the image 45% from the left
          transform: "translate(-50%, -10%)", // Adjust for more consistent centering
        });
      }     

      const updateHeight = () => {
        if (window.innerWidth <= 768) {  // For smaller screens
          setDynamicHeight("clamp(20%, 50%, 400px)");  // Shorter height on small screens
        } else {  // For larger screens
          setDynamicHeight("clamp(20%, 67%, 500px)");  // Keep the height similar to current on larger screens
        }
      };

      updateHeight(); // Set height initially
      window.addEventListener("resize", updateHeight); // Update on resize

      return () => {
        window.removeEventListener("resize", updateHeight); // Cleanup
      };
    }
  }, []);
   
  // Automatically change slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setAnimationKey((prev) => prev + 1);
    }, 3000); // 5 seconds per slide

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [slides.length]);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
         event.preventDefault();
       
         try {
          
           const formData = new FormData(event.currentTarget);
           
           // Log each entry in the FormData
           const formObject = formDataToObject(formData);
          
           const responseSubscriberDB = await addSubscribers(formObject.email);
 
           const responseSubscriberEmail = await fetch('/api/subscriber', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(formObject),
           })

           console.log(responseSubscriberEmail)

          if ( responseSubscriberEmail.ok && responseSubscriberDB.success) {
            setSuccessSubmit(true)
          }
           
       } catch (error) {          
           console.error(error);
       } finally {
           setIsLoading(false);
         }
       }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true); // Trigger animation when in view
        }
      },
      {
        threshold: 0.5, // Trigger animation when 50% of the element is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
      <div>  
      <section className="relative w-full h-[450px] sm:h-[500px] lg:h-[700px] overflow-hidden -mt-12">
      {/* Slideshow */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((image, index) => (
          <div
            key={`${index}-${animationKey}`} // Unique key ensures re-render
            className={`absolute inset-0 z-10 ${
              index === currentSlide ? 'block' : 'hidden'
            }`}
            style={{
              animation: index === currentSlide ? 'fadeInMove 1s ease-out' : '',
            }}
          >
            {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 z-0 fade-slide"
            style={{
              backgroundImage: `url(${image.backgroundImage})`, // Use slide-specific background image
              backgroundSize: 'cover',
              backgroundPosition: '5% 60%'
            }}
          ></div>

            {/* Main Slide Image */}
            <img
            src={image.mainImage}
            alt={`Slide ${index}`}
            className="absolute object-contain fade-slide2"
            style={{
              width: "auto", // Maintain aspect ratio
              height: dynamicHeight, // Dynamically adjust height
              top: imagePosition.top,  // Dynamically adjust top position
              left: imagePosition.left,  // Dynamically adjust left position
              transform: imagePosition.transform, // Dynamically adjust transform
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
          Woodland Designs
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
      <section 
        ref={sectionRef}
        className={`container mx-auto py-12 px-4 sm:px-6 lg:px-8`}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-8">
          Featured Artworks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Artwork Cards */}
          {galleryItems.map((art) => 
            art.featured ? (
              <div
                key={art.id}
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${inView ? 'slide-up' : ''}`}
              >
                <img
                  src={art.image_url || 'https://placehold.co/200x200'}
                  alt={`Artwork ${art.title}`}
                  width={500}
                  height={500}
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {art.title}
                  </h3>
                  <p className="text-gray-600 font-semibold">{`$${parseFloat(art.price).toFixed(2)}`}</p>
                  <p className="text-gray-600 font-semibold">{`${art.width} x ${art.length}`}</p>
                  
                  {/* Add a flex container for the buttons */}
                  <div className="flex justify-center space-x-4 mt-4">
                    <AddToCartButton art={art} />
                    <OrderNowButton art={art} />
                  </div>
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
              <p>"This painting brought a new energy to my living room!" - Stacey, IL</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <p>"I love how unique and personal each piece is." - Beth, WI</p>
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
        <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="p-2 rounded-lg text-black w-full sm:w-1/2 lg:w-1/3"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-teal-600 py-2 px-6 rounded-lg hover:bg-teal-700 mt-3"
          >
            Submit
          </button>
        </div>
        </form>
        {successSubmit && <p className="mt-5 text-white">You have been added to our email list!</p>}
      </section>
      </div>
  );
}
