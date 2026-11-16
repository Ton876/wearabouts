"use client";

import { useState } from "react";
import ItemPhoto from "@/components/ItemPhoto";
import { photoUrl } from "@/lib/format";

// foto utama besar, dengan deretan foto kecil dan panah kalau fotonya lebih dari satu
export default function ItemGallery({ item, faded = false, sizes, children }) {
  const [active, setActive] = useState(0);
  const total = item.photos?.length || 0;
  const go = (dir) => setActive((i) => (i + dir + total) % total);

  return (
    <div
      className="flex flex-col gap-3"
      onKeyDown={(e) => {
        if (total < 2) return;
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="relative">
        <ItemPhoto key={active} item={item} index={active} faded={faded} sizes={sizes} preload={active === 0}>
          {children}
        </ItemPhoto>
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-bg/80 text-lg backdrop-blur hover:bg-bg"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-bg/80 text-lg backdrop-blur hover:bg-bg"
            >
              →
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-bg/80 px-2.5 py-1 text-xs backdrop-blur">
              {active + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <ul className="flex gap-2 flex-wrap">
          {item.photos.map((p, i) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1} of ${total}`}
                aria-current={i === active}
                className={`block rounded-md overflow-hidden border-2 transition-opacity ${i === active ? "border-fg" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(p)} alt="" loading="lazy" className={`size-16 object-cover bg-photo ${faded ? "grayscale-[70%]" : ""}`} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
