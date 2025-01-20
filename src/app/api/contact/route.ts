import { NextResponse } from 'next/server';
import * as SibApiV3Sdk from "@sendinblue/client";
import getHtmlContact from "@/app/utils/getHtmlContact"
import { Carter_One } from 'next/font/google';

export async function POST(req: Request) {
  console.log('post request received')

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }
    
    const htmlContact = getHtmlContact(name, message, email);

    if (!process.env.YOUR_API_V3_KEY) {
      const errorMessage = "Missing required environment variable: YOUR_API_V3_KEY";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (!process.env.OWNERS_EMAIL) {
      const errorMessage = "Missing required environment variable: OWNERS_EMAIL";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const client = new SibApiV3Sdk.TransactionalEmailsApi();
    client.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.YOUR_API_V3_KEY 
    );

    const content = {
      sender: { name: name, email: process.env.OWNERS_EMAIL },
      to: [{ email: process.env.OWNERS_EMAIL }], // Correct format
      subject: "Woodland Designs: Contact Message",
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