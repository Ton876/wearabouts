import RequireAuth from "@/components/auth/RequireAuth";
import OrdersView from "@/components/pesanan/OrdersView";

export const metadata = {
  title: "My orders",
};

export default function OrdersPage() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <RequireAuth role="buyer">
        <OrdersView />
      </RequireAuth>
    </div>
  );
}
