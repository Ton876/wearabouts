import RequireAuth from "@/components/auth/RequireAuth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Admin",
};

export default function AdminLayout({ children }) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <RequireAuth role="admin">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <h1 className="font-display text-5xl sm:text-6xl leading-[1] tracking-tight">Admin</h1>
            <AdminNav />
          </div>
          {children}
        </div>
      </RequireAuth>
    </div>
  );
}
