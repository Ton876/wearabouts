"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ItemCard from "@/components/ItemCard";
import { useLoad } from "@/components/admin/useLoad";
import { api } from "@/lib/api";

// GET /wishlist dan DELETE /wishlist/:itemId
export default function WishlistView() {
  const { data, setData, error } = useLoad("/wishlist");
  const [msg, setMsg] = useState("");

  async function remove(itemId) {
    setMsg("");
    try {
      await api(`/wishlist/${itemId}`, { method: "DELETE", auth: true });
      setData((list) => list.filter((w) => w.item?._id !== itemId));
    } catch {
      setMsg("We couldn't remove it. Try again.");
    }
  }

  if (error) return <p role="alert" className="text-stamp">{error}</p>;
  if (!data) return <p className="text-fg-2">Loading...</p>;

  // barang yang sudah dihapus admin tidak ikut ditampilkan
  const wishes = data.filter((w) => w.item);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-5xl sm:text-6xl leading-[1] tracking-tight">Wishlist</h1>
        <p className="text-fg-2 max-w-md">Pieces you are keeping an eye on. Each one exists once, so don&rsquo;t wait too long.</p>
      </div>

      {msg && (
        <p role="alert" className="text-stamp text-sm">
          {msg}
        </p>
      )}

      {wishes.length === 0 ? (
        <div className="flex flex-col items-start gap-5 py-6">
          <p className="text-fg-2 text-lg">Nothing saved yet.</p>
          <Button href="/katalog">Browse the rail</Button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {wishes.map((w) => (
            <li key={w._id} className="flex flex-col gap-3">
              <ItemCard item={w.item} />
              <button
                type="button"
                onClick={() => remove(w.item._id)}
                className="self-start min-h-11 text-sm text-fg-2 underline underline-offset-4 hover:text-fg"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
