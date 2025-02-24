'use client'

import { useDispatch } from "react-redux";
import { addToCart } from "../../store/features/cartSlice"
import { useRouter } from "next/navigation";

export default function OrderNowButton({item}: any) {
    const dispatch = useDispatch();
    const router = useRouter();

    async function handleOrderNow(item: any) {
        await dispatch(addToCart(item))
        router.push('/cart');
    }

return (
    <div className="flex justify-center space-x-4 items-center">
        <button
            className="text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-full text-md font-medium transition-all"
            onClick={() => {
            handleOrderNow(item);
            }}
        >
            Order Now
        </button>
    </div>
    )
}