'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCart } from '../../store/features/cartSlice';

export default function CheckoutForm() {
  const cart = useSelector(selectCart);

  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsBilling(isChecked);
    if (isChecked) {
      setShippingAddress({ ...billingAddress });
    } else {
      setShippingAddress({ address: '', city: '', state: '', zip: '' });
    }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (sameAsBilling) {
      setShippingAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form>
        {/* Billing Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
          <input
            type="text"
            name="address"
            value={billingAddress.address}
            onChange={handleBillingChange}
            placeholder="Street Address"
            required
            className="mb-3 p-2 border border-gray-300 rounded-md w-full"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              value={billingAddress.city}
              onChange={handleBillingChange}
              placeholder="City"
              required
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            <input
              type="text"
              name="state"
              value={billingAddress.state}
              onChange={handleBillingChange}
              placeholder="State"
              required
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            <input
              type="text"
              name="zip"
              value={billingAddress.zip}
              onChange={handleBillingChange}
              placeholder="ZIP Code"
              required
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        {/* Checkbox for Same as Billing */}
        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Shipping Address Same as Billing Address
          </label>
        </div>

        {/* Shipping Information */}
        {!sameAsBilling && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleShippingChange}
              placeholder="Street Address"
              required
              className="mb-3 p-2 border border-gray-300 rounded-md w-full"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleShippingChange}
                placeholder="City"
                required
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleShippingChange}
                placeholder="State"
                required
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <input
                type="text"
                name="zip"
                value={shippingAddress.zip}
                onChange={handleShippingChange}
                placeholder="ZIP Code"
                required
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
        )}

        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <h2 className="text-gray-700 font-bold mb-2">Items:</h2>
                {cart.items.map((item)=>
                <li key={item.id} className="grid grid-cols-1 sm:grid-cols-8 gap-1 mt-3">
                <img src={item.image_url || 'https://placehold.co/10'}
                alt={`Image of ${item.title}`}
                className="w-16 h-16 object-cover mr-4"></img>
                <p className="text-gray-700">{`$${item.price}`}</p>
                </li>
                )}
                <p className="text-gray-700 font-bold mt-10">Total: {`$${cart.totalPrice}`}</p>
          </div>
      
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-teal-500 text-white py-2 px-4 rounded-md w-full hover:bg-teal-600"
          >
            Place Order
          </button>
      </form>
    </div>
  );
}






    