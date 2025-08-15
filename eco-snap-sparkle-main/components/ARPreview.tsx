"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ScoreRing } from '@/src/components/ScoreRing';

export default function ARPreview({ lockedScore }: { lockedScore?: number }) {
  const [supported, setSupported] = useState(false);
  const [score, setScore] = useState(lockedScore ?? 72);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // WebXR capability check
    const anyNav: any = navigator;
    if (anyNav.xr && anyNav.xr.isSessionSupported) {
      anyNav.xr.isSessionSupported('immersive-ar').then((ok: boolean) => setSupported(!!ok));
    }
  }, []);

  useEffect(() => { if (typeof lockedScore === 'number') setScore(lockedScore); }, [lockedScore]);

  // Fallback: video mock with parallax
  useEffect(() => {
    function onTilt(e: DeviceOrientationEvent) {
      const x = (e.gamma || 0) / 45; const y = (e.beta || 0) / 45;
      const el = overlayRef.current; if (!el) return;
      el.style.transform = `translate3d(${x*10}px, ${y*5}px, 0)`;
    }
    window.addEventListener('deviceorientation', onTilt);
    return () => window.removeEventListener('deviceorientation', onTilt);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative rounded-[32px] overflow-hidden border shadow-lg aspect-[9/19] bg-gradient-to-br from-neutral-900 to-neutral-800">
        <motion.div ref={overlayRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl backdrop-blur bg-white/40 dark:bg-black/30 border p-3 shadow-glow flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <ScoreRing score={score} size="sm" />
          <div className="text-sm font-medium">Eco score</div>
        </motion.div>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        <button className="px-3 py-1.5 rounded bg-primary text-white" onClick={()=> setScore(Math.max(0, Math.min(100, Math.round(score + (Math.random()*20-10))))) }>Randomize</button>
        <button className="px-3 py-1.5 rounded border" onClick={()=> setScore(lockedScore ?? 72)}>Lock</button>
      </div>
      {!supported && <p className="text-center text-xs text-muted-foreground mt-2">WebXR not available. Showing mock preview.</p>}
    </div>
  );
}


