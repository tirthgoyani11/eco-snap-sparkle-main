"use client";
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = { onCapture: (dataUrl: string) => void };

export default function CameraInput({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [auto, setAuto] = useState(false);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      }
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    })();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current; const canvas = canvasRef.current; if (!video || !canvas) return;
    const targetW = 640; const ratio = video.videoHeight ? video.videoWidth / video.videoHeight : 1.333;
    const w = targetW; const h = Math.round(targetW / ratio);
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(dataUrl);
  }, [onCapture]);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      const now = Date.now();
      if (now - lastRef.current < 1100) return;
      lastRef.current = now;
      capture();
    }, 1200);
    return () => clearInterval(id);
  }, [auto, capture]);

  return (
    <div className="space-y-2">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 rounded bg-primary text-white disabled:opacity-50" onClick={capture} disabled={!ready}>Capture</button>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Auto
        </label>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}


