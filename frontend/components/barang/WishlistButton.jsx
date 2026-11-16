"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

// POST /wishlist (409 = sudah tersimpan) dan DELETE /wishlist/:itemId
export default function WishlistButton({ itemId, disabled }) {
  const { user, ready } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "buyer") return;
    let live = true;
    api("/wishlist", { auth: true })
      .then((list) => live && setSaved(list.some((w) => w.item?._id === itemId)))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [user, itemId]);

  if (ready && user?.role === "admin") return null;

  if (ready && !user) {
    return (
      <Button href={`/masuk?next=${encodeURIComponent(`/barang/${itemId}`)}`} variant="secondary" disabled={disabled}>
        Sign in to save
      </Button>
    );
  }

  async function toggle() {
    setBusy(true);
    setError("");
    try {
      if (saved) await api(`/wishlist/${itemId}`, { method: "DELETE", auth: true });
      else await api("/wishlist", { method: "POST", auth: true, body: { itemId } });
      setSaved(!saved);
    } catch (err) {
      if (err.status === 409) setSaved(true);
      else setError("We couldn't update your wishlist.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="secondary" disabled={disabled || busy || !ready} onClick={toggle} aria-pressed={saved}>
        {saved ? "Saved ♥ Remove" : "Save to wishlist"}
      </Button>
      {error && (
        <p role="alert" className="text-stamp text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
