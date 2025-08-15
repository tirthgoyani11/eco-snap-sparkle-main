"use client";
import { useEffect, useMemo, useState } from 'react';
import { getScans } from '@/lib/storage';

export default function DashboardStats() {
  const [scans, setScans] = useState(getScans());
  useEffect(() => { setScans(getScans()); }, []);

  const total = scans.length;
  const avg = total ? Math.round(scans.reduce((a,b)=>a+b.score,0)/total) : 0;
  const best = scans.slice().sort((a,b)=>b.score-a.score)[0];

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="rounded-lg border p-4"><div className="text-sm text-muted-foreground">Total Scans</div><div className="text-2xl font-bold">{total}</div></div>
      <div className="rounded-lg border p-4"><div className="text-sm text-muted-foreground">Average Score</div><div className="text-2xl font-bold">{avg}</div></div>
      <div className="rounded-lg border p-4"><div className="text-sm text-muted-foreground">Best Item</div><div className="text-2xl font-bold">{best?.name || '-'}</div></div>
    </div>
  );
}


