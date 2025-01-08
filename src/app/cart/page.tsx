'use client'
import { selectCart, removeFromCart } from '../../store/features/cartSlice';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

export default function Page() {
    const cart = useSelector(selectCart);
    const dispatch = useDispatch();

    function handleDelete(item) {
        console.log('delete')
        dispatch(removeFromCart(item.id));
    }

    return (
        <div className="container mx-auto p-4">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold">Cart Summary</h1>
                <p className="text-lg text-gray-600">Review your items before checkout</p>
            </div>

            <section className="bg-white p-6 rounded-lg shadow-md">
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-1 border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">Item</h2>
                    <h2 className="text-lg font-semibold">Title</h2>
                    <h2 className="text-lg font-semibold">Price</h2>
                </div>

                {/* Cart Items */}
                {cart.items.length > 0 ? (
                    cart.items.map((item) => (
                        <div key={item.id} className="grid grid-cols-3 gap-4 py-4 border-b">
                            <div className="flex items-center">
                                <img
                                    src={item.image_url || '/placeholder.jpg'}
                                    alt={`Image of ${item.title}`}
                                    className="w-16 h-16 object-cover mr-4"
                                />
                            </div>
                            <div className="text-left">
                                <span className="text-lg font-semibold">{item.title}</span>
                            </div>
                            <div className="text-left">
                                <span className="text-lg font-semibold mr-2">${item.price}</span>
                                <button className="bg-red-600 hover:bg-red-700 rounded-lg pl-2 pr-2 text-white text-lg" onClick={()=>handleDelete(item)}>x</button>
                            </div>
                            
                        </div>
                    ))
                ) : (
                    <p className="col-span-2 text-center text-gray-500">Your cart is empty</p>
                )}

                {/* Total Price */}
                <div className="flex mt-6 border-t pt-4">
                    <span className="text-xl font-semibold mr-2">Total:</span>
                    <span className="text-xl font-semibold">${cart.totalPrice}</span>
                </div>

                {/* Checkout Button */}
                <div className="mt-6 flex justify-center">
                    <Link href={'/checkout'}>
                    <button className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 focus:outline-none">
                        Proceed to Checkout
                    </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
