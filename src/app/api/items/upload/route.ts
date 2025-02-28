import { NextResponse, NextRequest } from "next/server";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../../../../../firebaseConfig";
import admin from "../../../../../firebaseAdmin";

// Initialize Firebase storage and Firestore
const storage = getStorage(firebaseApp);
const firestore = getFirestore(firebaseApp);

// **Reusable Firestore Collection Helper**
async function streamToBlob(stream: ReadableStream<Uint8Array>): Promise<Blob> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return new Blob(chunks);
}

// **Authorization Helper**
async function isAuthorized(req: NextRequest): Promise<boolean> {
  try {
    const cookieHeader = req.headers.get('cookie');

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      const authToken = cookies['authToken'];
      console.log("authToken", authToken);

      if (authToken) {
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        return decodedToken.email === process.env.OWNERS_EMAIL;
      }
    }
  } catch (error) {
    console.error("Authorization error:", error);
  }

  return false;
}

export async function POST(req: Request) {
  console.log("Uploading image");
  const isAllowed = await isAuthorized(req as NextRequest);
  if (!isAllowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  console.log("Is allowed");
  try {
    const formData = await req.formData();
    const id = formData.get("id")?.toString();
    const file = formData.get("file") as File;
    const type = formData.get("type")?.toString();
    console.log("id:", id, "file:", file, "type:", type);

    if (!id || !file || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const blob = await streamToBlob(file.stream());
    const bucketName = 'artwebsite-eebdb.firebasestorage.app';
    const bucket = admin.storage().bucket(bucketName);
    const storageRef = bucket.file(`${type}/${file.name}`);

    
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await storageRef.save(buffer); 

    const [url] = await storageRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    return NextResponse.json({ image_url: url }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}