import { NextResponse } from 'next/server';
import * as SibApiV3Sdk from "@sendinblue/client";

export async function sendEmail(email: string, subject: string, htmlContent: string) {
  console.log('post request received')

  try {
    if (!email || !subject || !htmlContent) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }
    
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
      sender: { email: process.env.OWNERS_EMAIL },
      to: [{ email: email }], 
      subject: subject,
      htmlContent: htmlContent,
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