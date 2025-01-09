

import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useSelector } from 'react-redux';
import { selectCart } from '../../store/features/cartSlice'

export default function CartIcon() {
    const cart = useSelector(selectCart);

    return (
        <div className="flex items-start">
            <div className="text-sm font-semibold">${cart.totalPrice}</div>
            <div className="w-5 h-5 text-teal-500">
                <ShoppingCartIcon />
            </div>
        </div>
    )
}