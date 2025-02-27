import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";
import * as fs from 'fs'; // Import the file system module
import * as path from 'path'; // Import the path module

console.log("firebaseAdmin.ts file is running");
console.log("admin.apps.length:", admin.apps.length);

if (!admin.apps.length) {
    try {
        const serviceAccountPath = path.resolve('./firebase-service-account.json'); // Use path.resolve
        const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');
        const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully");
    } catch (error: any) {
        console.error("Firebase admin initialization error", error.stack);
    }
}

export default admin;