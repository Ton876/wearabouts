"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import StatusPill from "./StatusPill";
import ItemForm from "./ItemForm";
import { useLoad } from "./useLoad";
import { api } from "@/lib/api";
import { formatIDR, photoUrl } from "@/lib/format";

// daftar barang (GET /items) dengan tambah, ubah, dan hapus (hanya admin)
export default function AdminItems() {
  const { data, error, reload } = useLoad("/items", false);
  // null = form tertutup, "new" = tambah, objek = ubah
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState("");
  const [msg, setMsg] = useState("");

  async function remove(item) {
    setMsg("");
    try {
      await api(`/items/${item._id}`, { method: "DELETE", auth: true });
      setConfirmId("");
      reload();
    } catch (err) {
      setConfirmId("");
      setMsg(err.message);
    }
  }

  function saved() {
    setEditing(null);
    reload();
  }

  if (editing) {
    return <ItemForm item={editing === "new" ? null : editing} onSaved={saved} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-fg-2">{data ? `${data.length} pieces, ${data.filter((i) => i.status === "available").length} available` : ""}</p>
        <Button onClick={() => setEditing("new")}>Add a piece</Button>
      </div>

      {msg && (
        <p role="alert" className="text-stamp text-sm">
          {msg}
        </p>
      )}
      {error && <p role="alert" className="text-stamp">{error}</p>}
      {!data && !error && <p className="text-fg-2">Loading...</p>}

      {data && (
        <ul className="flex flex-col">
          {data.map((item) => (
            <li key={item._id} className="flex flex-wrap items-center gap-4 border-t border-line py-4">
              {item.photos?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl(item.photos[0])} alt="" className="size-16 rounded-md object-cover bg-photo shrink-0" />
              ) : (
                <div className="size-16 rounded-md bg-photo shrink-0" aria-hidden="true" />
              )}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 basis-48">
                <p className="font-display text-xl leading-tight truncate">{item.name}</p>
                <p className="text-sm text-fg-2">
                  {item.category} · {item.size} · {item.condition} · {formatIDR(item.price)}
                </p>
              </div>
              <StatusPill status={item.status} />
              <div className="flex gap-2">
                {confirmId === item._id ? (
                  <>
                    <Button variant="secondary" onClick={() => remove(item)} className="min-h-11 px-4 text-sm">
                      Delete for good
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmId("")}>
                      Keep
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => setEditing(item)} className="min-h-11 px-4 text-sm">
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmId(item._id)}>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
