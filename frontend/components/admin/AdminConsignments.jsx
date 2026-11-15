"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import StatusPill from "./StatusPill";
import { useLoad } from "./useLoad";
import { api } from "@/lib/api";
import { formatIDR, photoUrl, shortDate } from "@/lib/format";

// GET /consignments dan PATCH /consignments/:id (accepted / rejected)
export default function AdminConsignments() {
  const { data, setData, error } = useLoad("/consignments");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  async function review(c, status, adminNote) {
    setBusy(c._id);
    setMsg("");
    try {
      await api(`/consignments/${c._id}`, { method: "PATCH", auth: true, body: { status, adminNote } });
      setData((list) => list.map((x) => (x._id === c._id ? { ...x, status, adminNote } : x)));
    } catch (err) {
      setMsg(err.message);
    }
    setBusy("");
  }

  if (error) return <p role="alert" className="text-stamp">{error}</p>;
  if (!data) return <p className="text-fg-2">Loading...</p>;
  if (data.length === 0) return <p className="text-fg-2 py-8">No submissions yet.</p>;

  return (
    <div className="flex flex-col gap-4">
      {msg && (
        <p role="alert" className="text-stamp text-sm">
          {msg}
        </p>
      )}
      <ul className="flex flex-col">
        {data.map((c) => (
          <Submission key={c._id} c={c} busy={busy === c._id} onReview={review} />
        ))}
      </ul>
    </div>
  );
}

function Submission({ c, busy, onReview }) {
  const [note, setNote] = useState("");
  return (
    <li className="grid gap-5 border-t border-line py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl">{c.name}</span>
          <StatusPill status={c.status} />
        </div>
        <p className="text-sm text-fg-2">
          {[c.brand, c.category, `Size ${c.size}`, c.condition].filter(Boolean).join(" · ")}
        </p>
        <p>Asking {formatIDR(c.askingPrice)}</p>
        {c.description && <p className="text-fg-2 text-sm leading-relaxed">{c.description}</p>}
        <p className="text-sm text-fg-2">
          From {c.seller?.name} ({c.seller?.email}) · Contact: {c.contact} · {shortDate(c.createdAt)}
        </p>
        {c.photos?.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-1">
            {c.photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p} src={photoUrl(p)} alt="" className="size-20 rounded-md object-cover bg-photo" />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 md:items-start">
        {c.status === "pending" ? (
          <>
            <label className="flex flex-col gap-2 w-full">
              <span className="text-sm text-fg-2">Note for the seller (optional)</span>
              <textarea
                id={`note-${c._id}`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-line bg-bg px-4 py-3 text-[15px] focus:border-fg focus:outline-none"
              />
            </label>
            <div className="flex gap-2">
              <Button disabled={busy} onClick={() => onReview(c, "accepted", note)} className="min-h-11 px-4 text-sm">
                Accept
              </Button>
              <Button variant="secondary" disabled={busy} onClick={() => onReview(c, "rejected", note)} className="min-h-11 px-4 text-sm">
                Decline
              </Button>
            </div>
          </>
        ) : (
          c.adminNote && <p className="text-sm text-fg-2">Note: {c.adminNote}</p>
        )}
      </div>
    </li>
  );
}
