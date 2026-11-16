"use client";

import Button from "@/components/ui/Button";
import StatusPill from "@/components/admin/StatusPill";
import { useLoad } from "@/components/admin/useLoad";
import { formatIDR, photoUrl, shortDate } from "@/lib/format";

const label = {
  pending: "Under review",
  accepted: "Accepted",
  rejected: "Not accepted",
};

const note = {
  pending: "We are looking at your photos. You will hear from us within 3 working days.",
  accepted: "We would love to list this piece. We will reach you through the contact you left.",
  rejected: "We could not take this piece this time.",
};

// GET /consignments/mine (pengajuan jual milik sendiri)
export default function MyRequests() {
  const { data, error } = useLoad("/consignments/mine");

  if (error) return <p role="alert" className="text-stamp">{error}</p>;
  if (!data) return <p className="text-fg-2">Loading...</p>;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-start gap-5 py-6">
        <p className="text-fg-2 text-lg">You haven&rsquo;t sent us anything to sell yet.</p>
        <Button href="/jual">Sell with us</Button>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {data.map((r) => {
        const photo = photoUrl(r.photos?.[0]);
        return (
          <li key={r._id} className="grid gap-5 border-t border-line py-7 sm:grid-cols-[112px_minmax(0,1fr)]">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="aspect-[4/5] w-28 rounded-lg bg-photo object-cover" />
            ) : (
              <div className="aspect-[4/5] w-28 rounded-lg bg-photo" />
            )}

            <div className="flex flex-col gap-3 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-2xl leading-tight">{r.name}</span>
                <StatusPill status={r.status} label={label[r.status]} />
                <span className="text-sm text-fg-2">Sent {shortDate(r.createdAt)}</span>
              </div>

              <p className="text-sm text-fg-2">
                {[r.brand, r.size, r.condition].filter(Boolean).join(" · ")} · asking {formatIDR(r.askingPrice)}
              </p>

              {note[r.status] && <p className="text-fg-2">{note[r.status]}</p>}

              {r.adminNote && (
                <p className="border-l-2 border-gold pl-4 text-sm break-words">
                  <span className="text-fg-2">Note from us:</span> {r.adminNote}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
