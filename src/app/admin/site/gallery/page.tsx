// pages/gallery.tsx
'use client'
import GalleryForm from "@/app/components/GalleryForm";
import GalleryList from "@/app/components/GalleryList";

export default function GalleryPage() {
  return (
    <div className="">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Manage Gallery</h1>
      </div>
      <GalleryForm />
      <GalleryList />
    </div>
  );
}
