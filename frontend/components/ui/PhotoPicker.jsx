"use client";

import { useEffect, useRef, useState } from "react";
import { photoUrl } from "@/lib/format";

// foto yang dipilih: { file, url } untuk foto baru, { path, url } untuk foto lama yang sudah tersimpan
export function existingPhotos(paths = []) {
  return paths.map((path) => ({ path, url: photoUrl(path) }));
}

// pilih foto bertahap, bisa dihapus, dan urutannya bisa diatur (seret atau tombol panah). Foto pertama jadi sampul
export default function PhotoPicker({ photos, setPhotos, max = 5, name = "photos" }) {
  const [note, setNote] = useState("");
  const [dragFrom, setDragFrom] = useState(null);
  const latest = useRef(photos);
  latest.current = photos;

  // lepas URL preview saat komponen ditutup (hanya foto baru)
  useEffect(() => () => latest.current.forEach((p) => p.file && URL.revokeObjectURL(p.url)), []);

  function add(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    const seen = new Set(photos.filter((p) => p.file).map((p) => `${p.file.name}-${p.file.size}-${p.file.lastModified}`));
    const fresh = picked.filter((f) => !seen.has(`${f.name}-${f.size}-${f.lastModified}`));
    const room = max - photos.length;
    const take = fresh.slice(0, Math.max(room, 0));
    setNote(fresh.length > take.length ? `Only ${max} photos fit. The rest were skipped.` : "");
    setPhotos([...photos, ...take.map((file) => ({ file, url: URL.createObjectURL(file) }))]);
  }

  function remove(url) {
    const gone = photos.find((p) => p.url === url);
    if (gone?.file) URL.revokeObjectURL(gone.url);
    setNote("");
    setPhotos(photos.filter((p) => p.url !== url));
  }

  function move(from, to) {
    if (to < 0 || to >= photos.length || from === to) return;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setPhotos(next);
  }

  const full = photos.length >= max;

  return (
    <div className="flex flex-col gap-3">
      <label
        className={`flex items-center justify-center min-h-20 rounded-md border border-dashed text-[15px] ${
          full ? "border-line text-fg-2 cursor-not-allowed" : "border-line hover:border-fg cursor-pointer"
        }`}
      >
        <input name={name} type="file" accept="image/*" multiple disabled={full} onChange={add} className="sr-only" />
        {photos.length === 0 ? "Tap to add photos" : full ? `${max} of ${max} photos added` : `${photos.length} of ${max} photos. Tap to add more.`}
      </label>

      {note && (
        <p role="status" className="text-sm text-fg-2">
          {note}
        </p>
      )}

      {photos.length > 0 && (
        <>
          <ul className="flex gap-3 flex-wrap">
            {photos.map((p, i) => (
              <li
                key={p.url}
                draggable
                onDragStart={() => setDragFrom(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragFrom !== null) move(dragFrom, i);
                  setDragFrom(null);
                }}
                onDragEnd={() => setDragFrom(null)}
                className={`flex flex-col items-center gap-1.5 cursor-grab ${dragFrom === i ? "opacity-40" : ""}`}
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Photo ${i + 1}`} draggable={false} className="size-20 rounded-md object-cover bg-photo" />
                  {i === 0 && <span className="absolute left-1 bottom-1 rounded bg-fg px-1.5 py-0.5 text-[10px] leading-none text-bg">Cover</span>}
                  <button
                    type="button"
                    onClick={() => remove(p.url)}
                    aria-label={`Remove photo ${i + 1}`}
                    className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-fg text-bg text-sm leading-none hover:opacity-80"
                  >
                    ×
                  </button>
                </div>
                {photos.length > 1 && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0}
                      aria-label={`Move photo ${i + 1} earlier`}
                      className="grid size-8 place-items-center rounded border border-line text-sm hover:border-fg disabled:opacity-30 disabled:hover:border-line"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      disabled={i === photos.length - 1}
                      aria-label={`Move photo ${i + 1} later`}
                      className="grid size-8 place-items-center rounded border border-line text-sm hover:border-fg disabled:opacity-30 disabled:hover:border-line"
                    >
                      →
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {photos.length > 1 && <p className="text-sm text-fg-2">The first photo is the cover. Drag photos or use the arrows to change the order.</p>}
        </>
      )}
    </div>
  );
}
