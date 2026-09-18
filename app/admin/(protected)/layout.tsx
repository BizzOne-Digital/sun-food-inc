import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/getServerSession";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ToastProvider from "@/components/ui/ToastProvider";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-soft-bg">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">{children}</main>
      </div>
    </ToastProvider>
  );
}
