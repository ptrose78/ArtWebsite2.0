
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

        const client = new SibApiV3Sdk.TransactionalEmailsApi();
            client.setApiKey(
              SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
              process.env.YOUR_API_V3_KEY
            );
        
        const htmlReceipt = getHtmlReceipt(form, cart);
        
        const content = {
            sender: {email: "paultrose1@gmail.com"},
            to: [{email: form.email}, { email: "paultrose1@gmail.com" }],
            subject: "Art Website: Receipt",
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