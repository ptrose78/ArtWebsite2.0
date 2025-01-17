// pages/gallery.tsx
'use client'
import GalleryForm from "@/app/components/GalleryForm";
import GalleryList from "@/app/components/GalleryList";

export default function GalleryPage() {
  return (
    <div>
      <h1 className="text-center">Manage Gallery</h1>
      <GalleryForm />
      <GalleryList />
    </div>
  );
}
