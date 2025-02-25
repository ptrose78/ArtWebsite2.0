import { NextResponse } from "next/server";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../../../../../firebaseConfig";

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

export async function POST(req: Request) {
    try {
      const formData = await req.formData();
      const id = formData.get("id")?.toString();
      const file = formData.get("file") as File;
      const type = formData.get("type")?.toString();
  
      if (!id || !file) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      const blob = await streamToBlob(file.stream());
      const storageRef = ref(storage, `${type}/${file.name}`);
      await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
  
      return NextResponse.json({ image_url: downloadURL }, { status: 200 });
    } catch (error) {
      console.error("Error uploading image:", error);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
  }
  