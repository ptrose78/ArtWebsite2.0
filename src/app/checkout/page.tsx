'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { clearCart, selectCart } from '../../store/features/cartSlice';
import { useDeleteCardItemMutation } from "../../store/features/apiSlice"; 
import Link from 'next/link';

function formDataToObject(formData: FormData) {
  const obj: Record<string, any> = {};
  formData.forEach((value, key) => {
      obj[key] = value;
  });
  return obj;
}

export default function CheckoutForm() {
    const [card, setCard] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState('');
    const cart = useSelector(selectCart);
    const [deleteCardItem] = useDeleteCardItemMutation();
  
    const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;
  
    useEffect(() => {
      //load Square Web Payments SDK
      const loadSquare = async () => {
        if (!window.Square) {
          return;
        }
        console.log("square loaded")
        //initialize payments
        const payments = window.Square.payments(appId, locationId);
        console.log("Payments initialized perhaps:", payments); 
  
        if (!payments) {
          console.log("Failed to initialize Square Payments.");
          return;
        }
        
        try {
          const card = await payments.card();
          console.log("Card initialized:", card);
          await card.attach('#card-container'); // Attach to React-rendered div
          setCard(card);
        } catch (err) {
          console.error("Error initializing card:", err);
        }
      };
  
      loadSquare();
    }, []);
  
    const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
      console.log('handlePAYMENTs')
      e.preventDefault(); // Prevents the form from refreshing the page

      if (!card) {
        alert("Card element not initialized.");
        return;
      }
           
      const formData = new FormData(e.currentTarget);
      const formObject = formDataToObject(formData);

      const payload = {
        form: formObject,
        cart: cart
      }
  
      try {

        //Handle payment
        const result = await card.tokenize();
        console.log(result.status)
        if (result.status === "OK") {
          const responsePayment = await fetch("/api/square", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: result.token, cart }),
          });
  
          const dataPayment = await responsePayment.json();
          
        //Handle receipt
        if (dataPayment.message === "OK") {
          setPaymentStatus("SUCCESS Charge");
          const responseReceipt = await fetch("/api/receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(payload)
          })

          await clearCart(); 

          await handleDeleteFromFirebase(cart.items);
        }
        else {
          alert("Payment failed: " + result.errors[0].detail);
          setPaymentStatus("FAILED Charge");
        }
      }
      } catch (error) {
        console.error("Payment error: ", error);
        alert("An error occurred during payment.");
      }
    };

    const handleDeleteFromFirebase = async (items: any[]) => {
      try {
        // Pass the items to the mutation (single or multiple)
        const response = await deleteCardItem(items); 

        if (response.error) {
          console.log("Error deleting items:", response.error);
        } else {
          console.log("Items deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting items:", error);
      }
};

  const [emailAddress, setEmailAddress] = useState({
    email: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
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
      setShippingAddress({ firstName: '', lastName: '', address: '', city: '', state: '', zip: '' });
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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
    <div className="max-w-2xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-teal-700 text-center mb-3">Checkout</h1>
      <form onSubmit={handleCheckout}>
        
        {/* Billing Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-teal-600">Email Address</h3>
          <input
            type="email"
            name="email"
            value={emailAddress.email}
            onChange={handleEmailChange}
            placeholder="Email address (to receive receipt)"
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <h3 className="text-lg font-semibold mb-3 text-teal-600">Billing Address</h3>
          <input
            type="text"
            name="firstName"
            value={billingAddress.firstName}
            onChange={handleBillingChange}
            placeholder="First Name"
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="text"
            name="lastName"
            value={billingAddress.lastName}
            onChange={handleBillingChange}
            placeholder="Last Name"
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="text"
            name="address"
            value={billingAddress.address}
            onChange={handleBillingChange}
            placeholder="Street Address"
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              value={billingAddress.city}
              onChange={handleBillingChange}
              placeholder="City"
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="text"
              name="state"
              value={billingAddress.state}
              onChange={handleBillingChange}
              placeholder="State"
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="text"
              name="zip"
              value={billingAddress.zip}
              onChange={handleBillingChange}
              placeholder="ZIP Code"
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>
  
        {/* Checkbox for Same as Billing */}
        <div className="mb-8">
          <label className="inline-flex items-center text-gray-700">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={handleCheckboxChange}
              className="mr-2 focus:ring-teal-400"
            />
            Shipping Address Same as Billing Address
          </label>
        </div>

        Shipping Information
        {!sameAsBilling && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-teal-600">Shipping Address</h3>
            {/* Reuse input fields for Shipping Address */}
            <input
            type="text"
            name="firstName"
            value={shippingAddress.firstName}
            onChange={handleBillingChange}
            placeholder="First Name"
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="text"
            name="lastName"
            value={shippingAddress.lastName}
            onChange={handleBillingChange}
            placeholder="Last Name"
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="text"
            name="address"
            value={shippingAddress.address}
            onChange={handleBillingChange}
            placeholder="Street Address"
            required
            className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleBillingChange}
                placeholder="City"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleBillingChange}
                placeholder="State"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="text"
                name="zip"
                value={shippingAddress.zip}
                onChange={handleBillingChange}
                placeholder="ZIP Code"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>
        )} 
  
        {/* Order Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-teal-600">Order Summary</h3>
        <ul className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <li key={item.id} className="flex sm:flex-row items-start items-center py-4">
              <img
                src={item.image_url || 'https://placehold.co/10'}
                alt={`Image of ${item.title}`}
                className="w-16 h-16 object-cover rounded-md mr-4 sm:mr-0 sm:mb-0"
              />
              <div className="sm:ml-4">
                <p className="text-gray-700">{item.title}</p>
                <p className="text-gray-500 text-sm">{`${item.width} x ${item.length}`}</p>
              </div>
              <div className="ml-auto">
                <p className="text-gray-700 font-bold">${item.price}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xl font-bold text-gray-800 mt-4 text-right">
          Total: ${cart.totalPrice}
        </p>
      </div>

      {/* Payment Section */}
      <div>
        <p className="mb-6 text-center text-gray-600">
          All transactions are secure and encrypted.
        </p>
        <div id="card-container" className="mb-6"></div>
        <button
          // disabled={true}
          type="submit"
          className="bg-teal-500 text-white py-3 px-6 rounded-lg w-full hover:bg-teal-600 transition-all">
          Place Order
        </button>
        {paymentStatus && (
          <div className="mt-4 text-center">
            {paymentStatus === 'SUCCESS Charge' ? (
              <>
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-green-800">
                  Payment successful! Your receipt has been emailed to you.
                </p>
              </div>
              <div className="mt-4 text-center">
              <Link href="/gallery" className="text-teal-500 hover:text-teal-600">Continue Shopping</Link>
              </div>
              </>
            ) : (
              <div className="bg-red-100 p-4 rounded-lg">
                <p className="text-red-800">Payment failed. Please try again.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  </div>
);
}






    