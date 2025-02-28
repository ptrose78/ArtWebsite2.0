import { NextRequest } from "next/server";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirestore, doc, setDoc, updateDoc, deleteDoc, collection, getDocs, getDoc } from "firebase/firestore";
import { firebaseApp } from "../../../../firebaseConfig";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import admin from "../../../../firebaseAdmin"; 
import { getAuth } from "firebase/auth";

// Initialize Firebase storage and Firestore
const storage = getStorage(firebaseApp);
const firestore = getFirestore(firebaseApp);

export const config = {
  runtime: "edge",
};

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

// **Reusable Firestore Collection Helper**
const getCollectionRef = (type: string) => {
  if (type === "cards") return collection(firestore, "cards");
  if (type === "gallery") return collection(firestore, "gallery");
  throw new Error("Invalid item type");
};

async function getIdToken(req: NextRequest) {
  try {
    // Check Authorization header
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1];
      return await admin.auth().verifyIdToken(idToken);
    }

    // Check cookies if Authorization header is missing
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const authToken = cookies["authToken"];
      if (authToken) {
        return await admin.auth().verifyIdToken(authToken);
      }
    }
  } catch (error) {
    console.error("Token verification failed:", error);
  }

  return null; // Return null if no valid token found
}

// **Authorization Helper**
async function isAuthorized(req: NextRequest): Promise<boolean> {
  try {
    const cookieHeader = req.headers.get('cookie');
    console.log("cookieHeader", cookieHeader);

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
        console.log("decodedToken.email", decodedToken.email);
        console.log("decodedToken.uid", decodedToken.uid);
        return decodedToken.email === "paultrose1@gmail.com";
      }
    }
  } catch (error) {
    console.error("Authorization error:", error);
  }

  return false;
}

// **Handle Uploading Items (POST)**
export async function POST(req: Request) {
  
  const isAllowed = await isAuthorized(req as NextRequest);
  console.log("isAllowed", isAllowed);

  if (!isAllowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const decodedToken = await getIdToken(req as NextRequest);

  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const storageUserId = decodedToken.uid; // Get the authenticated user's UID
    console.log("storageUserId", storageUserId);
    const formData = await req.formData();
    const type = formData.get("type")?.toString();
    const title = formData.get("title")?.toString();
    const price = formData.get("price")?.toString();
    const width = formData.get("width")?.toString();
    const length = formData.get("length")?.toString();
    const featured = formData.get("featured")?.toString();
    const file = formData.get("file") as File;

    if (!type || !title || !price || !featured || !file || !width || !length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Convert file stream to blob
    const blob = await streamToBlob(file.stream());

   
    // Store the file in `gallery/{userId}/{file.name}`
    const storageRef = ref(storage, `${type}/${storageUserId}/${file.name}`);
    console.log("storageRef", storageRef);
    await uploadBytesResumable(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    // Prepare Firestore document data
    const itemData = {
      title,
      price,
      width,
      length,
      featured: featured === "true",
      image_url: downloadURL,
      type,
      file: file.name,
      storageUserId: storageUserId,
      date: new Date().toISOString(),
    };

    // Rename userId for Firestore to avoid clash
    const firestoreUserId = storageUserId;
    console.log("firestoreUserId", firestoreUserId);

    const docId = uuidv4();
    const docRef = doc(firestore, type, docId);
    console.log("docRef", docRef);
    await setDoc(docRef, {
      firestoreUserId: firestoreUserId,  // Store firestoreUserId inside the document
      ...itemData          // Other data fields
    });
    

    return NextResponse.json(
      { message: `${type} item created successfully`, itemData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to upload item" }, { status: 500 });
  }
}

// **Fetch Items (GET)**
export async function GET(req: NextRequest) {

  try {
    const type = req.nextUrl.searchParams.get("type");

    if (!type) return NextResponse.json({ error: "Missing type parameter" }, { status: 400 });

    const collectionRef = getCollectionRef(type);
    const snapshot = await getDocs(collectionRef);;

    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(
      { message: `${type} items fetched successfully`, items },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

// **Update Items (PUT)**
export async function PUT(req: Request) {
  const isAllowed = await isAuthorized(req as NextRequest);
  if (!isAllowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    console.log("Content type:", contentType);

    const formData = await req.formData();
    const id = formData.get("id")?.toString();
    const type = formData.get("type")?.toString();
    const title = formData.get("title")?.toString();
    const price = formData.get("price")?.toString();
    const width = formData.get("width")?.toString();
    const length = formData.get("length")?.toString();
    const featured = formData.get("featured")?.toString();
    const image_url = formData.get("image_url")?.toString();
    const file = formData.get("file") as File;

    console.log("Received form data:", { type, title, price, featured, file, width, length, image_url });

    if (!id || !type || !title || !price || !featured || !file || !width || !length || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const docRef = doc(firestore, type, id);
    const updatedFields: any = { title, price, width, length, featured, image_url, updatedAt: new Date().toISOString() };

    const blob = await streamToBlob(file.stream());
    const storageRef = ref(storage, `${type}/${file.name}`);
    await uploadBytesResumable(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    updatedFields.image_url = downloadURL;

    // Check if the document exists and if the image_url is present
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const existingData = docSnapshot.data();
      console.log("Existing data:", existingData);
      if (existingData.image_url) {
        await deleteObject(ref(storage, existingData.image_url)).catch((err) => console.error("Failed to delete old file:", err));
      }
    }

    await updateDoc(docRef, updatedFields);
    return NextResponse.json({ message: `${type} item updated successfully` }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// **Delete Items (DELETE)**
export async function DELETE(req: Request) {
  const isAllowed = await isAuthorized(req as NextRequest);
  if (!isAllowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { items } = await req.json();
    const itemsArray = Array.isArray(items) ? items : [items];
    console.log("itemsArray", itemsArray);

    if (itemsArray.length === 0) {
      return NextResponse.json({ message: "No items to delete" });
    }

    for (const item of itemsArray) {
      if (!item.type || !item.id) {
        console.warn("Skipping item without type or id:", item);
        continue;
      }
      // Construct the file path
      const filePath = `${item.type}/${item.storageUserId}/${item.file}`;

      // Create a reference to the file in Firebase Storage
      const fileRef = ref(storage, filePath)

      await deleteObject(fileRef);

      console.log(`Deleting document: ${item.id}`);
      await deleteDoc(doc(firestore, item.type, item.id));
    }

    return NextResponse.json({ message: "Items deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to delete items" }, { status: 500 });
  }
}