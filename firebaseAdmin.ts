import admin from "firebase-admin"
import type { ServiceAccount } from "firebase-admin"
console.log("firebaseAdmin.ts file is running");
console.log("process.env.FIREBASE_SERVICE_ACCOUNT_KEY", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
console.log("admin.apps.length:", admin.apps.length)

if (!admin.apps.length) {
    try {
        const encodedServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!encodedServiceAccount) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
        }

        const decodedServiceAccount = Buffer.from(encodedServiceAccount, 'base64').toString('utf8');
        const serviceAccount = JSON.parse(decodedServiceAccount) as ServiceAccount;

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully");
    } catch (error: any) {
        console.error("Firebase admin initialization error", error.stack);
    }
}

export default admin;
