"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Stars from "@/components/pesanan/Stars";
import { useLoad } from "./useLoad";
import { api } from "@/lib/api";
import { shortDate } from "@/lib/format";

// GET /reviews (semua ulasan terbaru) dan PATCH /reviews/:id/featured
// ulasan yang ditandai muncul di beranda, halaman barang tetap menampilkan semuanya
export default function AdminReviews() {
  const { data, setData, error } = useLoad("/reviews?limit=50", false);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  async function toggle(review) {
    setBusy(review._id);
    setMsg("");
    const featured = !review.featured;
    try {
      await api(`/reviews/${review._id}/featured`, { method: "PATCH", auth: true, body: { featured } });
      setData((list) => list.map((r) => (r._id === review._id ? { ...r, featured } : r)));
    } catch (err) {
      setMsg(err.message);
    }
    setBusy("");
  }

  if (error) return <p role="alert" className="text-stamp">{error}</p>;
  if (!data) return <p className="text-fg-2">Loading...</p>;

  const count = data.filter((r) => r.featured).length;
  // hanya bintang 4 dan 5 yang boleh ke beranda, komentar tidak wajib
  const eligible = (r) => r.rating >= 4;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-fg-2 max-w-xl">
        Pick 4 and 5 star reviews for the home page, with or without a comment. Every review stays visible on its own piece. {count} picked right now.
      </p>

      {msg && (
        <p role="alert" className="text-stamp text-sm">
          {msg}
        </p>
      )}

      {data.length === 0 ? (
        <p className="text-fg-2 py-6">No reviews yet.</p>
      ) : (
        <ul className="flex flex-col">
          {data.map((r) => (
            <li key={r._id} className="grid gap-4 border-t border-line py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars value={r.rating} size="text-lg" />
                  <span className="text-sm text-fg-2">{shortDate(r.createdAt)}</span>
                </div>
                {r.comment ? <p className="leading-relaxed break-words">{r.comment}</p> : <p className="text-fg-2">No comment.</p>}
                <p className="text-sm text-fg-2">
                  {r.user?.name || "A buyer"} on{" "}
                  {r.item ? (
                    <Link href={`/barang/${r.item._id}`} className="underline underline-offset-4 hover:text-fg">
                      {r.item.name}
                    </Link>
                  ) : (
                    "a removed piece"
                  )}
                </p>
              </div>
              <Button variant={r.featured ? "primary" : "secondary"} disabled={busy === r._id || (!eligible(r) && !r.featured)} onClick={() => toggle(r)} aria-pressed={Boolean(r.featured)}>
                {r.featured ? "On home page" : eligible(r) ? "Show on home" : "Under 4 stars"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
