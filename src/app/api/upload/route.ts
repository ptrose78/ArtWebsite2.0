import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { NextRequest, NextResponse } from 'next/server';
import { firebaseApp } from '../../../../firebaseConfig';

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser to handle file uploads
  },
};

// Helper to convert readable stream to a Blob
async function streamToBlob(stream: ReadableStream<Uint8Array>): Promise<Blob> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value!);
  }

  return new Blob(chunks);
}

export async function POST(req: Request) {
    console.log('sdfsd')
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const blob = await streamToBlob(file.stream());

    // Upload file to Firebase Storage
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `gallery/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    console.log('uploadTask')
    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        () => resolve()
      );
    });

    // Get the public URL for the uploaded file
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    return NextResponse.json({ image_url: downloadURL }, { status: 200 });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
