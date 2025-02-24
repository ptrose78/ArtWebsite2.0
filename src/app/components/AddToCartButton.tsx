'use client'
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/features/cartSlice"

export default function AddToCartButton({item}: any) {
    const dispatch = useDispatch();

    async function handleAddToCart(item: any) {
        await dispatch(addToCart(item))
    }

return (
    <div className="flex justify-center space-x-4 items-center">
        <button
            className="text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-full text-md font-medium transition-all"
            onClick={() => {
            handleAddToCart(item);
            }}
        >
            Add To Cart
        </button>
    </div>
    )
}