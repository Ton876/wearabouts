import RequireAuth from "@/components/auth/RequireAuth";
import WishlistView from "@/components/incaran/WishlistView";

export const metadata = {
  title: "Wishlist",
};

export default function WishlistPage() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <RequireAuth role="buyer">
        <WishlistView />
      </RequireAuth>
    </div>
  );
}
