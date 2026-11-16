"use client";

import { useEffect, useRef, useState } from "react";

// pilih foto bertahap: foto baru ditambah ke yang sudah ada, bisa dihapus satu per satu
export default function PhotoPicker({ photos, setPhotos, max = 5, name = "photos" }) {
  const [note, setNote] = useState("");
  const latest = useRef(photos);
  latest.current = photos;

  // lepas URL preview saat komponen ditutup
  useEffect(() => () => latest.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  function add(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    const seen = new Set(photos.map((p) => `${p.file.name}-${p.file.size}-${p.file.lastModified}`));
    const fresh = picked.filter((f) => !seen.has(`${f.name}-${f.size}-${f.lastModified}`));
    const room = max - photos.length;
    const take = fresh.slice(0, Math.max(room, 0));
    setNote(fresh.length > take.length ? `Only ${max} photos fit. The rest were skipped.` : "");
    setPhotos([...photos, ...take.map((file) => ({ file, url: URL.createObjectURL(file) }))]);
  }

  function remove(url) {
    URL.revokeObjectURL(url);
    setNote("");
    setPhotos(photos.filter((p) => p.url !== url));
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
        <ul className="flex gap-3 flex-wrap">
          {photos.map((p, i) => (
            <li key={p.url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`Photo ${i + 1}`} className="size-20 rounded-md object-cover bg-photo" />
              <button
                type="button"
                onClick={() => remove(p.url)}
                aria-label={`Remove photo ${i + 1}`}
                className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-fg text-bg text-sm leading-none hover:opacity-80"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
