"use client";
import { getLeaderboard, setLeaderboard } from '@/lib/storage';

export default function LeaderboardPage() {
  const entries = getLeaderboard();
  return (
    <main className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Leaderboard</h1>
      <ol className="space-y-2">
        {entries.map((e, i) => (
          <li key={e.name} className="flex items-center gap-3 border rounded-lg p-3">
            <span className="w-6 text-right">{i+1}.</span>
            <span className="flex-1 font-medium">{e.name}</span>
            <span className="text-muted-foreground">{e.points} pts</span>
          </li>
        ))}
      </ol>
    </main>
  );
}


