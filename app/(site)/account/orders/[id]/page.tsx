import { redirect, notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Order, { IOrderItem } from "@/models/Order";
import { getServerUserSession } from "@/lib/getServerSession";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerUserSession();
  if (!session) redirect("/account/login");

  const { id } = await params;
  let order = null;
  try {
    await connectToDatabase();
    order = await Order.findOne({ _id: id, user: session.id }).lean();
  } catch {
    order = null;
  }

  if (!order) notFound();

  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl font-bold text-brown mb-2">Order {order.orderNumber}</h1>
      <p className="text-brown/70 mb-6">
        Status: <span className="text-leaf font-semibold">{order.orderStatus}</span> · Payment: {order.paymentStatus}
      </p>

      <div className="bg-white border border-beige rounded-2xl p-6 mb-6">
        {order.items.map((item: IOrderItem, i: number) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span>{item.name} x{item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-beige mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-soft-bg rounded-2xl p-6">
        <h2 className="font-semibold text-brown mb-2">Shipping Address</h2>
        <p className="text-sm text-brown/80">
          {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
      </div>
    </div>
  );
}
