import admin from "firebase-admin";

if (!admin.apps.length) {
    try {
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
