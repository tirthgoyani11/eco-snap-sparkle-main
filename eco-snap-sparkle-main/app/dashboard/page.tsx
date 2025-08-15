"use client";
import { useEffect, useMemo, useState } from 'react';
import { addScan, getScans } from '@/lib/storage';

export default function DashboardPage() {
  const [scans, setScans] = useState(getScans());
  useEffect(() => { setScans(getScans()); }, []);

  const total = scans.length;
  const avg = total ? Math.round(scans.reduce((a,b)=>a+b.score,0)/total) : 0;
  const best = scans.slice().sort((a,b)=>b.score-a.score)[0];

  return (
    <main className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4"><div className="text-sm text-muted-foreground">Total Scans</div><div className="text-2xl font-bold">{total}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-muted-foreground">Average Score</div><div className="text-2xl font-bold">{avg}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-muted-foreground">Best Item</div><div className="text-2xl font-bold">{best?.name || '-'}</div></div>
      </div>
      <div>
        <h2 className="font-medium mb-2">Recent Scans</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted"><tr><th className="text-left px-3 py-2">Name</th><th className="text-left px-3 py-2">Score</th><th className="text-left px-3 py-2">Date</th></tr></thead>
            <tbody>
              {scans.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="px-3 py-2">{s.name}</td>
                  <td className="px-3 py-2">{s.score}</td>
                  <td className="px-3 py-2">{new Date(s.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}


