"use client";
import dynamic from 'next/dynamic';
const ARPreview = dynamic(() => import('@/components/ARPreview'), { ssr: false });

export default function ARPreviewPage() {
  return (
    <main className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">AR Preview</h1>
      <ARPreview />
    </main>
  );
}


