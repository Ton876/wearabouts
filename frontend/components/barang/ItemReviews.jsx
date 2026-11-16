"use client";

import { useEffect, useState } from "react";
import Stars from "@/components/pesanan/Stars";
import { api } from "@/lib/api";
import { shortDate } from "@/lib/format";

// GET /reviews/item/:id (publik). Tidak tampil kalau belum ada ulasan
export default function ItemReviews({ itemId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api(`/reviews/item/${itemId}`)
      .then(setData)
      .catch(() => {});
  }, [itemId]);

  if (!data || data.total === 0) return null;

  return (
    <section aria-labelledby="reviews" className="flex flex-col gap-5 border-t border-line pt-10 max-w-2xl">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="reviews" className="font-display text-3xl">Reviews</h2>
        <Stars value={Math.round(data.averageRating)} size="text-xl" />
        <span className="text-sm text-fg-2">
          {data.averageRating} from {data.total} {data.total === 1 ? "review" : "reviews"}
        </span>
      </div>
      <ul className="flex flex-col gap-5">
        {data.reviews.map((r) => (
          <li key={r._id} className="flex flex-col gap-1.5">
            <Stars value={r.rating} size="text-base" />
            {r.comment && <p className="leading-relaxed">{r.comment}</p>}
            <p className="text-sm text-fg-2">
              {r.user?.name || "A buyer"} · {shortDate(r.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
