"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import ItemPhoto from "@/components/ItemPhoto";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { getItem } from "@/lib/items";
import { formatIDR, itemMeta, orderCode } from "@/lib/format";

const field = "w-full min-h-12 rounded-md border border-line bg-bg px-4 text-[15px] focus:border-fg focus:outline-none";

// POST /orders, satu barang per pesanan. Wajib di dalam Suspense (useSearchParams)
export default function CheckoutView() {
  const itemId = useSearchParams().get("item");
  const { user } = useAuth();
  // undefined = memuat, null = tidak ditemukan
  const [item, setItem] = useState(undefined);
  const [state, setState] = useState({ sending: false, error: "", order: null, beaten: false });

  useEffect(() => {
    if (!itemId) return;
    getItem(itemId)
      .then(setItem)
      .catch(() => setItem(null));
  }, [itemId]);

  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const shippingAddress = {
      name: form.get("name").trim(),
      phone: form.get("phone").trim(),
      address: form.get("address").trim(),
    };

    setState({ sending: true, error: "", order: null, beaten: false });
    try {
      const order = await api("/orders", { method: "POST", auth: true, body: { itemId, shippingAddress } });
      setState({ sending: false, error: "", order, beaten: false });
    } catch (err) {
      // 409: barang diambil pembeli lain saat form diisi
      if (err.status === 409) setState({ sending: false, error: "", order: null, beaten: true });
      else setState({ sending: false, error: err.status === 401 ? "Your session ended. Sign in again to continue." : "We couldn't place the order. Check your details and try again.", order: null, beaten: false });
    }
  }

  if (!itemId || item === null) {
    return <Notice title="We couldn't find that piece." text="The link may be old, or the piece was taken off the rail." />;
  }
  if (item === undefined) return <p className="text-fg-2 py-16">Loading...</p>;

  if (state.order) {
    const o = state.order;
    return (
      <div className="max-w-xl flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-sm text-fg-2">Order {orderCode(o)}</span>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1] tracking-tight">It&rsquo;s yours.</h1>
          <p className="text-fg-2 leading-relaxed">
            We&rsquo;re holding {item.name} for you. Our team confirms your payment, then packs and ships it. If payment doesn&rsquo;t arrive within 24 hours, the order is cancelled and the piece goes back on the rail.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-6">
          <Row label="Total" value={formatIDR(o.price)} />
          <Row label="Status" value="Waiting for payment" />
          <Row label="Ship to" value={o.shippingAddress.name} />
          <Row label="Phone" value={o.shippingAddress.phone} />
          <div className="col-span-2">
            <Row label="Address" value={o.shippingAddress.address} />
          </div>
        </dl>
        <div className="flex flex-wrap gap-3">
          <Button href="/pesanan">View my orders</Button>
          <Button href="/katalog" variant="secondary">
            Keep browsing
          </Button>
        </div>
      </div>
    );
  }

  if (state.beaten || item.status === "sold") {
    return (
      <Notice
        title="Someone got there first."
        text="Every piece here exists once, and another checkout went through while you were filling this in. It happens with the good ones."
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-20">
      <form onSubmit={submit} className="flex flex-col gap-6 max-w-xl">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-5xl sm:text-6xl leading-[1] tracking-tight">Checkout</h1>
          <p className="text-fg-2 leading-relaxed">Tell us where to send it. The first checkout to go through claims the piece.</p>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-fg-2">Full name</span>
          <input id="name" name="name" required defaultValue={user?.name || ""} autoComplete="name" className={field} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-fg-2">Phone number</span>
          <input id="phone" name="phone" type="tel" required minLength={8} autoComplete="tel" placeholder="0812 3456 7890" className={field} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-fg-2">Full address</span>
          <textarea id="address" name="address" required rows={4} autoComplete="street-address" placeholder="Street, number, district, city, postal code" className={`${field} py-3 min-h-28`} />
        </label>

        {state.error && (
          <p role="alert" className="text-stamp text-sm">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={state.sending} className="self-start min-w-52">
          {state.sending ? "Placing your order..." : `Place order · ${formatIDR(item.price)}`}
        </Button>
      </form>

      <aside className="flex flex-col gap-5 self-start lg:sticky lg:top-[calc(var(--header-h,69px)+24px)]">
        <h2 className="text-sm text-fg-2">Your piece</h2>
        <div className="flex gap-4">
          <ItemPhoto item={item} className="w-28 shrink-0" sizes="112px" compact />
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="font-display text-2xl leading-tight">{item.name}</p>
            <p className="text-sm text-fg-2">{itemMeta(item)}</p>
          </div>
        </div>
        <dl className="flex flex-col gap-3 border-t border-line pt-5">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-2">Piece</dt>
            <dd>{formatIDR(item.price)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-lg">
            <dt>Total</dt>
            <dd className="font-medium">{formatIDR(item.price)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-fg-2">{label}</dt>
      <dd className="text-lg break-words">{value}</dd>
    </div>
  );
}

function Notice({ title, text }) {
  return (
    <div className="max-w-xl flex flex-col items-start gap-5 py-8">
      <h1 className="font-display text-5xl leading-[1.05] tracking-tight">{title}</h1>
      <p className="text-fg-2 leading-relaxed">{text}</p>
      <Button href="/katalog">Back to the rail</Button>
    </div>
  );
}
