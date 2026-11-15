const styles = {
  available: "bg-gold text-on-gold border-gold",
  sold: "border-line text-fg-2",
  pending: "bg-gold text-on-gold border-gold",
  paid: "bg-panel text-on-panel border-panel",
  shipped: "bg-panel text-on-panel border-panel",
  completed: "border-fg text-fg",
  cancelled: "border-line text-fg-2",
  accepted: "border-fg text-fg",
  rejected: "border-stamp text-stamp",
};

export default function StatusPill({ status, label }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium capitalize ${styles[status] || "border-line"}`}>
      {label || status}
    </span>
  );
}
