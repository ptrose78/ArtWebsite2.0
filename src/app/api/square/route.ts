import { Client, Environment } from "square";
import { NextResponse } from 'next/server';

const client = new Client({
  environment: Environment.Sandbox, // Use `Environment.Production` for live
  accessToken: process.env.SANDBOX_SQUARE_ACCESS_TOKEN, // Replace with your Sandbox Access Token
});

export async function POST(req) {
  try {
    console.log(req.body)
    if (!req.body) {
      return NextResponse.json({ error: "Request body is missing." }, { status: 400 });
  }
    // Parse request body
    const body = await req.json();
    const { token, cart } = body;
    
    // Convert dollars to cents and create a bigint
    const amountInDollars = cart.price;
    const amountInCents = BigInt(Math.round(amountInDollars * 100)); // Crucial conversion and rounding

     // Check for required fields
     if (!token ) {
      return new Response(
        JSON.stringify({ error: "Missing token or cart data." }),
        { status: 400 }
      );
    }
    console.log("Token:", token);
    // console.log("Cart:", cart);

    const response = await client.paymentsApi.createPayment({
      sourceId: token,
      idempotencyKey: crypto.randomUUID(), // Generate a unique ID
      amountMoney: {
        amount: amountInCents,
        currency: 'USD'
      }
    });
    console.log('sent payment')
    // Stringify the response, handling BigInts
    const jsonResponse = JSON.parse(JSON.stringify(response.result, (key, value) =>
      typeof value === 'bigint'
          ? value.toString()
          : value // return everything else unchanged
  ));
  console.log(jsonResponse)
  return NextResponse.json({ message: "OK", response: jsonResponse }, { status: 200 });

  } catch (error: any) {
    console.error("Error processing payment:", error);

    // Extract detailed error info if available
    const errorDetails =
      error.response?.errors || [{ detail: error.message || "Unknown error" }];

    return NextResponse.json(
      {
        message: "Payment failed",
        error: errorDetails,
      },
      { status: 500 }
    );
  }
}
