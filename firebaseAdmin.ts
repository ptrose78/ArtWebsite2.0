console.log("firebaseAdmin.ts file is running");
import admin from "firebase-admin";
console.log("process.env.FIREBASE_SERVICE_ACCOUNT_KEY", process.env.FIREBASE_ADMIN_CREDENTIALS);

if (!admin.apps.length) {
    try {

        if (!process.env.FIREBASE_ADMIN_CREDENTIALS) {
            console.error("FIREBASE_ADMIN_CREDENTIALS is missing in environment variables.");
        } else {
            console.log("FIREBASE_ADMIN_CREDENTIALS exists.");
        }
        const base64EncodedServiceAccount = process.env.FIREBASE_ADMIN_CREDENTIALS;

        if (!base64EncodedServiceAccount) {
            throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is missing");
        }

        // Decode Base64 back to JSON
        const serviceAccountJson = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf8');
        const serviceAccount = JSON.parse(serviceAccountJson);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log("Firebase Admin SDK initialized successfully");
    } catch (error: any) {
        console.error("Firebase admin initialization error", error);
    }
}

export default admin;
