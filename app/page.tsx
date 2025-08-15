import Link from 'next/link';
import { Button } from '@/src/components/ui/button';

export default function HomePage() {
  return (
    <main className="container mx-auto py-10">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">EcoSnap AI</h1>
        <p className="text-muted-foreground">Scan products, get eco scores, and discover greener alternatives.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/scanner"><Button>Open Scanner</Button></Link>
          <Link href="/bulk"><Button variant="outline">Bulk Scan</Button></Link>
          <Link href="/dashboard"><Button variant="secondary">Dashboard</Button></Link>
          <Link href="/leaderboard"><Button variant="ghost">Leaderboard</Button></Link>
          <Link href="/ar-preview"><Button variant="outline">AR Preview</Button></Link>
        </div>
      </div>
    </main>
  );
}


