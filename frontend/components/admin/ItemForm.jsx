"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PhotoPicker from "@/components/ui/PhotoPicker";
import { api } from "@/lib/api";
import { CATEGORIES, SIZES, CONDITIONS } from "@/lib/config";

const field = "w-full min-h-12 rounded-md border border-line bg-bg px-4 text-[15px] focus:border-fg focus:outline-none";
const labelCls = "text-sm text-fg-2";

// tambah (POST /items) atau ubah (PUT /items/:id), multipart supaya bisa kirim foto
export default function ItemForm({ item, onSaved, onCancel }) {
  const [photos, setPhotos] = useState([]);
  const [state, setState] = useState({ sending: false, error: "" });

  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.delete("photos");
    // ubah tanpa foto baru: foto lama dipertahankan backend
    photos.forEach((p) => form.append("photos", p.file));

    setState({ sending: true, error: "" });
    try {
      const saved = await api(item ? `/items/${item._id}` : "/items", { method: item ? "PUT" : "POST", body: form, auth: true });
      onSaved(saved);
    } catch (err) {
      setState({ sending: false, error: err.message });
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-line p-6 sm:p-8 md:grid-cols-2">
      <h2 className="font-display text-3xl md:col-span-2">{item ? "Edit piece" : "Add a piece"}</h2>

      <label className="flex flex-col gap-2 md:col-span-2">
        <span className={labelCls}>Name</span>
        <input id="f-name" name="name" required defaultValue={item?.name} className={field} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Category</span>
        <select id="f-category" name="category" required defaultValue={item?.category || ""} className={field}>
          <option value="" disabled>
            Choose one
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Size</span>
        <select id="f-size" name="size" required defaultValue={item?.size || ""} className={field}>
          <option value="" disabled>
            Choose one
          </option>
          {SIZES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Condition</span>
        <select id="f-condition" name="condition" required defaultValue={item?.condition || ""} className={field}>
          <option value="" disabled>
            Choose one
          </option>
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Price (IDR)</span>
        <input id="f-price" name="price" type="number" min="0" step="1000" required defaultValue={item?.price} className={field} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Chest (cm)</span>
        <input id="f-chest" name="chest" type="number" min="0" defaultValue={item?.measurements?.chest} className={field} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Length (cm)</span>
        <input id="f-length" name="length" type="number" min="0" defaultValue={item?.measurements?.length} className={field} />
      </label>

      <label className="flex flex-col gap-2 md:col-span-2">
        <span className={labelCls}>Description</span>
        <textarea id="f-description" name="description" rows={3} maxLength={600} defaultValue={item?.description} className={`${field} py-3 min-h-24`} />
      </label>

      <div className="flex flex-col gap-2 md:col-span-2">
        <span className={labelCls}>
          Photos (up to 5){item ? ". New photos replace the current ones." : ""}
        </span>
        <PhotoPicker photos={photos} setPhotos={setPhotos} />
      </div>

      {state.error && (
        <p role="alert" className="text-stamp text-sm md:col-span-2">
          {state.error}
        </p>
      )}

      <div className="flex gap-3 md:col-span-2">
        <Button type="submit" disabled={state.sending}>
          {state.sending ? "Saving..." : item ? "Save changes" : "Add piece"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
