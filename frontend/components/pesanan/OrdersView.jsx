"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ItemPhoto from "@/components/ItemPhoto";
import StatusPill from "@/components/admin/StatusPill";
import { useLoad } from "@/components/admin/useLoad";
import PaymentInstructions from "./PaymentInstructions";
import ReviewForm from "./ReviewForm";
import { formatIDR, itemMeta, orderCode, shortDate } from "@/lib/format";

const note = {
  pending: "Waiting for payment. We hold the piece for 24 hours.",
  paid: "Payment confirmed. We are packing it.",
  shipped: "On its way to you.",
  completed: "Delivered.",
  cancelled: "This order was cancelled and the piece went back on the rail.",
};

// GET /orders (pesanan milik sendiri)
export default function OrdersView() {
  const { data, error } = useLoad("/orders/me");
  const [reviewed, setReviewed] = useState([]);

  if (error) return <p role="alert" className="text-stamp">{error}</p>;
  if (!data) return <p className="text-fg-2">Loading...</p>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h1 className="font-display text-5xl sm:text-6xl leading-[1] tracking-tight">My orders</h1>
        <Button href="/pengajuan" variant="ghost">
          Your sell requests
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-start gap-5 py-6">
          <p className="text-fg-2 text-lg">You haven&rsquo;t found anything yet.</p>
          <Button href="/katalog">Browse the rail</Button>
        </div>
      ) : (
        <ul className="flex flex-col">
          {data.map((o) => {
            const done = reviewed.includes(o._id);
            return (
              <li key={o._id} className="grid gap-5 border-t border-line py-7 sm:grid-cols-[112px_minmax(0,1fr)]">
                {o.item ? <ItemPhoto item={o.item} className="w-28" sizes="112px" compact /> : <div className="aspect-[4/5] w-28 rounded-lg bg-photo" />}

                <div className="flex flex-col gap-4 min-w-0">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-xl">{orderCode(o)}</span>
                      <StatusPill status={o.status} />
                      <span className="text-sm text-fg-2">{shortDate(o.createdAt)}</span>
                    </div>
                    {o.item ? (
                      <Link href={`/barang/${o.item._id}`} className="font-display text-2xl leading-tight hover:opacity-70 transition-opacity">
                        {o.item.name}
                      </Link>
                    ) : (
                      <p className="font-display text-2xl">Piece removed</p>
                    )}
                    {o.item && <p className="text-sm text-fg-2">{itemMeta(o.item)}</p>}
                    <p>{formatIDR(o.price)}</p>
                  </div>

                  {o.status === "pending" ? <PaymentInstructions order={o} /> : <p className="text-fg-2">{note[o.status]}</p>}

                  {o.shippingAddress && (
                    <p className="text-sm text-fg-2 break-words">
                      Ship to {o.shippingAddress.name}, {o.shippingAddress.address}
                    </p>
                  )}

                  {o.status === "completed" &&
                    (done ? (
                      <p className="text-sm">Thanks, your review is posted.</p>
                    ) : (
                      <ReviewForm orderId={o._id} onDone={() => setReviewed((r) => [...r, o._id])} />
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
