"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Pieces" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/consignments", label: "Submissions" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-2 border-b border-line">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`px-4 min-h-12 flex items-center text-[15px] -mb-px border-b-2 transition-colors ${active ? "border-fg text-fg" : "border-transparent text-fg-2 hover:text-fg"}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
