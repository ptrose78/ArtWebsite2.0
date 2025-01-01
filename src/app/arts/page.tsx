import { fetchArts } from '@/app/lib/data';
import Link from 'next/link';

export default async function Page() {
  const arts = await fetchArts();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {arts.map((art) => (
          <div key={art.id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200">
              <img
                src={art.image_url || '/placeholder-image.jpg'}
                alt={art.title || 'Artwork'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{art.title || 'Artwork Title'}</h2>
              <p className="text-gray-600 mt-2">${art.price}</p>
              <div className="flex justify-between mt-4">
                <Link href={`/order/${art.id}`} className="text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded">
                  Order Now
                </Link>
                <button className="text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white px-4 py-2 rounded">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
