
import { NextResponse } from 'next/server';
import * as SibApiV3Sdk from "@sendinblue/client";
import getHtmlReceipt from "@/app/utils/getHtmlReceipt"

export async function POST(req) {
    try {
        const { form, cart } = await req.json();

        if (!form || !cart) {
            return NextResponse.json(
                {success: false, error: "Missing request body"},
                {status: 400}
            )
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
        
        const htmlReceipt = getHtmlReceipt(form, cart);
        
        //Note: The sender email is setup inside of Brevo.com. This
        //allows an email to be sent from the chosen email 
        // using the Brevo API
        const content = {
            sender: {email: process.env.OWNERS_EMAIL},
            to: [{email: form.email}, {email: process.env.OWNERS_EMAIL}],
            subject: "Woodland Designs: Receipt",
            htmlContent: htmlReceipt
        }
        const response = await client.sendTransacEmail(content);

        return NextResponse.json(
            {success: true, response},
            {status: 200}
        )
    } catch (error:any) {
        console.error("Error sending receipt: ", error);
        const errorDetails = 
            error.response?.errors || [{detail: error.message || "Unknown error"}];

        return NextResponse.json({
            message: "Receipt failed",
            error: errorDetails
        }, {
            status: 500
        } )
    }
}