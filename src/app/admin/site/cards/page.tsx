// pages/gallery.tsx
'use client'
import CardForm from "@/app/components/CardForm";
import CardList from "@/app/components/CardList";

export default function GalleryPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <CardForm />
      <CardList />
    </div>
  );
}
