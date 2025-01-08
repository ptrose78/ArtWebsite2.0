'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { selectCart } from '../../store/features/cartSlice';
import Link from 'next/link';
import { deleteArts } from '@/app/lib/data'; 

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
  
    const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;
  
    useEffect(() => {
      //load Square Web Payments SDK
      console.log('rerender inside useEffect')
      const loadSquare = async () => {
        if (!window.Square) {
          return;
        }
  
        //initialize payments
        const payments = window.Square.payments(appId, locationId);
        console.log(payments)
  
        if (!payments) {
          return;
        }
  
        try {
          const card = await payments.card();
          console.log(card)
          await card.attach('#card-container'); // Attach to React-rendered div
          setCard(card);
        } catch (err) {
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

          const responseDeleteArts = await deleteArts(cart); 
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleCheckout}>
        {/* Billing Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Email Address</h3>
          <input
            type="email"
            name="email"
            value={emailAddress.email}
            onChange={handleEmailChange}
            placeholder="email address (To receive receipt)"
            required
            className="mb-3 p-2 border border-gray-300 rounded-md w-full"
            />
          <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
          <input
            type="text"
            name="firstName"
            value={billingAddress.firstName}
            onChange={handleBillingChange}
            placeholder="First Name"
            required
            className="mb-3 mr-2 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="lastName"
            value={billingAddress.lastName}
            onChange={handleBillingChange}
            placeholder="Last Name"
            required
            className="mb-3 p-2 border border-gray-300 rounded-md"
            />
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
              name="firstName"
              value={shippingAddress.firstName}
              onChange={handleShippingChange}
              placeholder="First Name"
              required
              className="mb-3 mr-2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="lastName"
              value={shippingAddress.lastName}
              onChange={handleShippingChange}
              placeholder="Last Name"
              required
              className="mb-3 p-2 border border-gray-300 rounded-md"
            />
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
        <div>
          <div>
          <p className="mb-5 text-center">All transactions are secure and encrypted.</p>
            <div id="card-container"></div>
            {/* The Square card element will be injected here */}
          </div>
            
            {/* Submit Button */}
            <button
              disabled={!card}
              type="submit"
              className="bg-teal-500 text-white py-2 px-4 rounded-md w-full hover:bg-teal-600">
                Place Order
            </button>
            {paymentStatus && (
            <div className="text-white mt-3 text-center">
              {paymentStatus === 'SUCCESS Charge' ? (
                <div>
                <p className="bg-forestGreen mb-4 p-2 rounded-md border-green-800">You successfully paid. Your receipt has been emailed to you. Check your spam folder if necessary.</p>
                <Link href='/arts' className="bg-teal-500 p-2 mt-4 rounded-md"><button>Return to Gallery</button></Link>
                </div>
              ) : (
                <p className="bg-red-500 border-red-600">Sorry, your payment did not process. Review your credit card information and try again.</p>
              )}
            </div>
          )}     
        </div>
      </form>
    </div>
  );
}






    