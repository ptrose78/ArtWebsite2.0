'use client'
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/features/cartSlice"

export default function AddToCartButton({art}: any) {
    console.log(art)
    const dispatch = useDispatch();

    async function handleAddToCart(art: any) {
        console.log(art)
        await dispatch(addToCart(art))
    }

return (
    <div className="flex justify-center space-x-4 items-center mt-6">
        <button
            className="text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-full text-md font-medium transition-all"
            onClick={() => {
            handleAddToCart(art);
            }}
        >
            Add To Cart
        </button>
    </div>
    )
}