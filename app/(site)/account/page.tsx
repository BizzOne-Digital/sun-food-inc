import { redirect } from "next/navigation";
import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { getServerUserSession } from "@/lib/getServerSession";

export default async function AccountDashboardPage() {
  const session = await getServerUserSession();
  if (!session) redirect("/account/login");

  let user = null;
  try {
    await connectToDatabase();
    user = await User.findById(session.id).lean();
  } catch {
    user = null;
  }

  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl font-bold text-brown mb-2">
        Welcome, {user?.firstName || "back"}
      </h1>
      <p className="text-brown/70 mb-8">Manage your orders and saved addresses.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/account/orders" className="bg-white border border-beige rounded-2xl p-6 hover:border-orange">
          <h2 className="font-heading text-xl font-semibold text-brown mb-1">Order History</h2>
          <p className="text-sm text-brown/70">View your past orders and their status.</p>
        </Link>
        <Link href="/account/addresses" className="bg-white border border-beige rounded-2xl p-6 hover:border-orange">
          <h2 className="font-heading text-xl font-semibold text-brown mb-1">Addresses</h2>
          <p className="text-sm text-brown/70">Manage your saved shipping addresses.</p>
        </Link>
      </div>
    </div>
  );
}
