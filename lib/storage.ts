"use client";
import type { ScanRecord } from './types';

const KEY_SCANS = 'ecosnap_scans_v1';
const KEY_LEADER = 'ecosnap_leaderboard_v1';

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getScans(): ScanRecord[] {
  return safeGet<ScanRecord[]>(KEY_SCANS, []);
}

export function addScan(record: ScanRecord): void {
  const list = getScans();
  list.unshift(record);
  safeSet(KEY_SCANS, list.slice(0, 100));
}

export type LeaderEntry = { name: string; points: number };

export function getLeaderboard(): LeaderEntry[] {
  return safeGet<LeaderEntry[]>(KEY_LEADER, [
    { name: 'Ava', points: 1280 },
    { name: 'Liam', points: 1060 },
    { name: 'Noah', points: 990 },
    { name: 'Mia', points: 920 }
  ]);
}

export function setLeaderboard(entries: LeaderEntry[]): void {
  safeSet(KEY_LEADER, entries);
}


