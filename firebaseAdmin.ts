import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

console.log("firebaseAdmin.ts file is running");
console.log("admin.apps.length:", admin.apps.length);

if (!admin.apps.length) {
    try {
        // Get the service account credentials from the environment variable
        const serviceAccountJson = process.env.FIREBASE_ADMIN_CREDENTIALS;

        if (!serviceAccountJson) {
            throw new Error('FIREBASE_ADMIN_CREDENTIALS environment variable is missing.');
        }

        const serviceAccount: ServiceAccount = JSON.parse(serviceAccountJson);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log("Firebase Admin SDK initialized successfully");
    } catch (error: any) {
        console.error("Firebase admin initialization error", error.stack);
    }
}

export default admin;
