"use client";
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

const Scanner = dynamic(() => import('react-qr-barcode-scanner').then(m => m.BarcodeScannerComponent as any), { ssr: false } as any);

type Props = { onDetect: (barcode: string) => void };

export default function BarcodeInput({ onDetect }: Props) {
  const handleUpdate = useCallback((err: any, result: any) => {
    if (result?.getText) {
      onDetect(result.getText());
    } else if (result?.text) {
      onDetect(result.text);
    }
  }, [onDetect]);

  return (
    <div className="space-y-2">
      <div className="rounded-lg overflow-hidden bg-black aspect-video">
        {/* @ts-expect-error lib types */}
        <Scanner onUpdate={handleUpdate} />
      </div>
    </div>
  );
}


