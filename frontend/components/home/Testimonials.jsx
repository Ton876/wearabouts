"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Stars from "@/components/pesanan/Stars";
import { api } from "@/lib/api";
import { USE_MOCK } from "@/lib/config";
import { photoUrl } from "@/lib/format";

// GET /reviews?featured=true (ulasan pilihan admin). Section hilang kalau belum ada yang dipilih
export default function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (USE_MOCK) return;
    api("/reviews?featured=true&limit=6")
      .then((list) => setReviews(list))
      .catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="buyers" className="pt-24 flex flex-col gap-10">
      <Reveal className="flex flex-col gap-3">
        <span className="text-sm text-fg-2">From the people who wore them</span>
        <h2 id="buyers" className="font-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
          Where they <span className="italic">went.</span>
        </h2>
      </Reveal>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => {
          const photo = photoUrl(r.item?.photos?.[0]);
          return (
            <Reveal as="li" key={r._id} delay={(i % 3) * 90} className="flex flex-col gap-4 rounded-lg border border-line p-6">
              <Stars value={r.rating} size="text-lg" />
                {r.comment?.trim() ? (
                <p className="leading-relaxed line-clamp-5">{r.comment}</p>
              ) : (
                <p className="text-fg-2 italic">Rated {r.rating} out of 5.</p>
              )}
                <div className="mt-auto flex items-center gap-3 pt-2">
                  {photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt="" className="size-12 shrink-0 rounded-md object-cover bg-photo" />
                  )}
                  <div className="min-w-0 text-sm">
                    <p>{r.user?.name || "A buyer"}</p>
                    {r.item && (
                      <Link href={`/barang/${r.item._id}`} className="text-fg-2 underline underline-offset-4 hover:text-fg break-words">
                        {r.item.name}
                      </Link>
                    )}
                  </div>
                </div>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
