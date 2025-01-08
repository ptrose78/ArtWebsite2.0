'use client';
import { useEffect, useState, useRef } from 'react';

export default function PaymentForm() {
  
  const [card, setCard] = useState<any>(null);

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

  const handlePayment = async () => {
    console.log('handlePAYMENT')
    if (!card) {
      alert("Card element not initialized.");
      return;
    }

    try {
      console.log('try in handle payment')
      const result = await card.tokenize();
      console.log(result.status)
      if (result.status === "OK") {
        const response = await fetch("/api/square", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: result.token }),
        });

        const data = await response.json();
        console.log(data)
        console.log("success")
      
      } else {
        alert("Payment failed: " + result.errors[0].detail);
      }
    } catch (error) {
      console.error("Payment error: ", error);
      alert("An error occurred during payment.");
    }
  };

  return (
    <div>
      <div>
      <p className="mb-5 text-center">All transactions are secure and encrypted.</p>
        <div id="card-container"></div>
          {/* The Square card element will be injected here */}
        </div>
          {/* Submit Button */}
          <button
            onClick={handlePayment} disabled={!card}
            type="submit"
            className="bg-teal-500 text-white py-2 px-4 rounded-md w-full hover:bg-teal-600"
          >
            Place Order
          </button>
    </div>
   
  );
}
