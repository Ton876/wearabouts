"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import StatusPill from "./StatusPill";
import { useLoad } from "./useLoad";
import { api } from "@/lib/api";
import { formatIDR, orderCode, shortDate } from "@/lib/format";

// urutan status sama dengan backend (satu arah)
const next = {
  pending: [
    ["paid", "Mark as paid"],
    ["cancelled", "Cancel"],
  ],
  paid: [
    ["shipped", "Mark as shipped"],
    ["cancelled", "Cancel"],
  ],
  shipped: [["completed", "Mark as completed"]],
  completed: [],
  cancelled: [],
};

// GET /orders dan PATCH /orders/:id/status
export default function AdminOrders() {
  const { data, setData, error } = useLoad("/orders");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  async function setStatus(order, status) {
    setBusy(order._id);
    setMsg("");
    try {
      await api(`/orders/${order._id}/status`, { method: "PATCH", auth: true, body: { status } });
      setData((list) => list.map((o) => (o._id === order._id ? { ...o, status } : o)));
    } catch (err) {
      setMsg(err.message);
    }
    setBusy("");
  }

  if (error) return <p role="alert" className="text-stamp">{error}</p>;
  if (!data) return <p className="text-fg-2">Loading...</p>;
  if (data.length === 0) return <p className="text-fg-2 py-8">No orders yet.</p>;

  return (
    <div className="flex flex-col gap-4">
      {msg && (
        <p role="alert" className="text-stamp text-sm">
          {msg}
        </p>
      )}
      <ul className="flex flex-col">
        {data.map((o) => (
          <li key={o._id} className="grid gap-4 border-t border-line py-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto] md:items-start">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-display text-xl">{orderCode(o)}</span>
                <StatusPill status={o.status} />
              </div>
              <p className="text-fg-2 text-sm">{shortDate(o.createdAt)}</p>
              <p className="mt-1">{o.item?.name || "Piece removed"}</p>
              <p className="text-fg-2 text-sm">{formatIDR(o.price)}</p>
            </div>

            <div className="flex flex-col gap-1 text-sm min-w-0">
              <p className="text-fg-2">Buyer: {o.buyer?.name} ({o.buyer?.email})</p>
              <p>{o.shippingAddress?.name} · {o.shippingAddress?.phone}</p>
              <p className="text-fg-2 break-words">{o.shippingAddress?.address}</p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {next[o.status].map(([status, label]) => (
                <Button
                  key={status}
                  variant={status === "cancelled" ? "secondary" : "primary"}
                  disabled={busy === o._id}
                  onClick={() => setStatus(o, status)}
                  className="min-h-11 px-4 text-sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
