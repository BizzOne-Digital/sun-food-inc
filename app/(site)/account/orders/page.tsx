import { redirect } from "next/navigation";
import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerUserSession } from "@/lib/getServerSession";

export default async function AccountOrdersPage() {
  const session = await getServerUserSession();
  if (!session) redirect("/account/login");

  let orders: { _id: string; orderNumber: string; total: number; orderStatus: string; createdAt: Date }[] = [];
  try {
    await connectToDatabase();
    const docs = await Order.find({ user: session.id }).sort({ createdAt: -1 }).lean();
    orders = docs.map((o) => ({
      _id: String(o._id),
      orderNumber: o.orderNumber,
      total: o.total,
      orderStatus: o.orderStatus,
      createdAt: o.createdAt,
    }));
  } catch {
    orders = [];
  }

  return (
    <div className="container-page py-16 max-w-3xl mx-auto">
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-brown/70">You have no orders yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <Link
              key={o._id}
              href={`/account/orders/${o._id}`}
              className="flex items-center justify-between bg-white border border-beige rounded-xl p-4 hover:border-orange"
            >
              <div>
                <div className="font-semibold text-brown">{o.orderNumber}</div>
                <div className="text-sm text-brown/60">{new Date(o.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange">${o.total.toFixed(2)}</div>
                <div className="text-sm text-leaf">{o.orderStatus}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
