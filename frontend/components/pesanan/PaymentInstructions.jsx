"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { PAYMENT_ACCOUNT, PAYMENT_WINDOW_HOURS } from "@/lib/payment";
import { formatIDR, orderCode, shortDateTime } from "@/lib/format";

// cara bayar untuk pesanan pending: transfer manual, lalu admin mengonfirmasi
export default function PaymentInstructions({ order }) {
  const [copied, setCopied] = useState(false);
  const deadline = new Date(new Date(order.createdAt).getTime() + PAYMENT_WINDOW_HOURS * 60 * 60 * 1000);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(PAYMENT_ACCOUNT.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line p-5">
      <p className="text-sm text-fg-2">
        Pay by bank transfer before {shortDateTime(deadline)}, or the order is cancelled and the piece goes back on the rail. Once we see the
        transfer, your order moves to Paid.
      </p>

      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 text-[15px]">
        <dt className="text-fg-2">Bank</dt>
        <dd>{PAYMENT_ACCOUNT.bank}</dd>

        <dt className="text-fg-2">Account number</dt>
        <dd className="flex flex-wrap items-center gap-3">
          <span>{PAYMENT_ACCOUNT.number}</span>
          <Button type="button" variant="ghost" onClick={copyNumber}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </dd>

        <dt className="text-fg-2">Account name</dt>
        <dd>{PAYMENT_ACCOUNT.holder}</dd>

        <dt className="text-fg-2">Amount</dt>
        <dd>{formatIDR(order.price)}</dd>

        <dt className="text-fg-2">Transfer note</dt>
        <dd>Order {orderCode(order)}</dd>
      </dl>
    </div>
  );
}
