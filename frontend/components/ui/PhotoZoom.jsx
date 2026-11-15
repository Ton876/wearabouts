"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { photoUrl } from "@/lib/format";

// deretan foto kecil, klik untuk membuka besar. Panah kiri kanan pindah foto, Esc menutup
export default function PhotoZoom({ photos = [], thumbClass = "size-20" }) {
  const [open, setOpen] = useState(null);
  const closeRef = useRef(null);
  const total = photos.length;

  const move = useCallback((dir) => setOpen((i) => (i === null ? i : (i + dir + total) % total)), [total]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, move]);

  if (!total) return null;

  return (
    <>
      <ul className="flex gap-2 flex-wrap pt-1">
        {photos.map((p, i) => (
          <li key={p}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${total}`} className="block rounded-md overflow-hidden hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl(p)} alt="" className={`${thumbClass} object-cover bg-photo`} />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${open + 1} of ${total}`}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(photos[open])} alt="" onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full object-contain rounded-md" />

          <button ref={closeRef} type="button" onClick={() => setOpen(null)} aria-label="Close" className="absolute top-4 right-4 min-h-11 min-w-11 rounded-full bg-white/15 text-white text-2xl hover:bg-white/25">
            ×
          </button>

          {total > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="Previous photo" className="absolute left-3 sm:left-6 min-h-11 min-w-11 rounded-full bg-white/15 text-white text-xl hover:bg-white/25">
                ←
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="Next photo" className="absolute right-3 sm:right-6 min-h-11 min-w-11 rounded-full bg-white/15 text-white text-xl hover:bg-white/25">
                →
              </button>
              <p className="absolute bottom-4 text-sm text-white/80">
                {open + 1} / {total}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
