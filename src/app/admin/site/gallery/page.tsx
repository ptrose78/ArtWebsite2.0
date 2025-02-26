// pages/gallery.tsx
'use client'
import GalleryForm from "@/app/components/GalleryForm";
import GalleryList from "@/app/components/GalleryList";

export default function GalleryPage() {
  return (
    <div>
      <GalleryForm />
      <GalleryList />
    </div>
  );
}
