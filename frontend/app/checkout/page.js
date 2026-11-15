import RequireAuth from "@/components/auth/RequireAuth";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <RequireAuth role="buyer">
        <CheckoutView />
      </RequireAuth>
    </div>
  );
}
