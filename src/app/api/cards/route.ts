import { NextRequest, NextFetchEvent } from 'next/server';
import { createEdgeRouter } from 'next-connect';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';
import { getFirestore, doc, setDoc, updateDoc, deleteDoc, collection, getDoc, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../../../firebaseConfig';
import { NextResponse } from 'next/server';
import multiparty from 'multiparty';  // Using multiparty instead of formidable
import { v4 as uuidv4 } from "uuid";

// Initialize Firebase storage and Firestore
const storage = getStorage(firebaseApp);
const firestore = getFirestore(firebaseApp);

export const config = {
  runtime: 'edge', // Ensure it's set to 'edge' for Edge functions
};

async function streamToBlob(stream: ReadableStream<Uint8Array>): Promise<Blob> {
  const chunks: Uint8Array[] = []; 
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  // Convert the chunks to a single Blob
  return new Blob(chunks);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    console.log("formData", formData)

    const title = formData.get('title')?.toString();
    const price = formData.get('price')?.toString();
    const width = formData.get('width')?.toString();
    const length = formData.get('length')?.toString();
    const featured = formData.get('featured')?.toString();
    const file = formData.get('file') as File;
   
    // Validation
    if (!title || !price || !featured || !file || !width || !length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const blob = await streamToBlob(file.stream());
    console.log("blob", blob)
    console.log("storage", storage)

    // Firebase Storage Upload
    const storageRef = ref(storage, `cards/${file.name}`);
    const uploadPromise = new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error), // Handle upload error
        () => resolve(uploadTask.snapshot) // Handle successful upload
      );
    });

    const snapshot = await uploadPromise;
    console.log("snapshot", snapshot)
    const downloadURL = await getDownloadURL((snapshot as any).ref);
    console.log("downloadURL", downloadURL)

    // Firestore Document Creation
    const cardItems = {
      title,
      price,
      width,
      length,
      featured: featured==="true",
      image_url: downloadURL,
      date: new Date().toISOString(),
    };
    console.log("cardItems", cardItems)

    const uuid = uuidv4();
    const docRef = doc(firestore, 'cards', uuid);
    await setDoc(docRef, cardItems);

    return NextResponse.json(
      { message: 'Card item created successfully', cardItems },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image or save card item' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cardCollection = collection(firestore, 'cards');
    const snapshot = await getDocs(cardCollection);

    const cardItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { message: 'Card items fetched successfully', cardItems },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card items' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    // Parse JSON from the request body
    const body = await req.json();

    const { id, price, featured, image_url, file, width, length } = body;

    // Validate required fields
    if (!id || !price || !width || !length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const docRef = doc(firestore, "cards", id);

    // Prepare fields to update
    const updatedFields: any = {
      price,
      updatedAt: new Date().toISOString(),
    };

    // If a new file is provided, upload it to Firebase Storage
    if (file) {
      const buffer = Buffer.from(file.data, "base64"); // Decode base64 file data
      const storageRef = ref(storage, `cards/${file.name}`);
      const uploadResult = await uploadBytes(storageRef, buffer);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      updatedFields.image_url = downloadURL;

      // Optionally delete the old file
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();
        if (existingData.image_url) {
          const oldFileRef = ref(storage, existingData.image_url);
          await deleteObject(oldFileRef).catch((err) =>
            console.error("Failed to delete old file:", err)
          );
        }
      }
    }

    // Update Firestore document
    await updateDoc(docRef, updatedFields);

    return NextResponse.json(
      { message: "Card item updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to update card item" },
      { status: 500 }
    );
  }
}



export async function DELETE(req: Request) {
  try {
    const { id, image_url } = await req.json();
    console.log("id", id)
    console.log(image_url)
    // Validate required fields
    if (!id || !image_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Delete file from Firebase Storage
    const fileRef = ref(storage, image_url);
    await deleteObject(fileRef);

    // Delete document from Firestore
    const docRef = doc(firestore, 'cards', id);
    await deleteDoc(docRef);

    return NextResponse.json(
      { message: 'Card item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete card item' },
      { status: 500 }
    );
  }
}
