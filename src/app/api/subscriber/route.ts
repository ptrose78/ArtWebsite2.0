import { NextResponse } from 'next/server';
import * as SibApiV3Sdk from "@sendinblue/client";
import getHtmlSubscriber from "@/app/utils/getHtmlSubscriber"
import { Carter_One } from 'next/font/google';

export async function POST(req: Request) {
  console.log('post request received')

  try {
    
    const { email} = await req.json();
    console.log(email)
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }
    
    const htmlContact = getHtmlSubscriber(email);

    if (!process.env.YOUR_API_V3_KEY) {
      const errorMessage = "Missing required environment variable: YOUR_API_V3_KEY";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const client = new SibApiV3Sdk.TransactionalEmailsApi();
    client.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.YOUR_API_V3_KEY 
    );

    const content = {
      sender: { email: process.env.OWNERS_EMAIL },
      to: [{ email: process.env.OWNERS_EMAIL }], // Correct format
      subject: "Woodland Designs: New Subscriber!",
      htmlContent: htmlContact,
    };    

    const response = await client.sendTransacEmail(content);

      return NextResponse.json(
        { success: true, response },
        { status: 200 }
      );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}