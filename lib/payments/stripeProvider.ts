import Stripe from "stripe";
import { PaymentInitParams, PaymentInitResult, PaymentProvider } from "./types";

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to your environment variables.");
  }
  return new Stripe(key);
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",
  async initPayment(params: PaymentInitParams): Promise<PaymentInitResult> {
    const stripe = getStripeClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: params.customerEmail,
      line_items: [
        {
          price_data: {
            currency: params.currency.toLowerCase(),
            product_data: { name: `SUNN Foods Order ${params.orderNumber}` },
            unit_amount: Math.round(params.amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/checkout/success?order=${params.orderNumber}`,
      cancel_url: `${siteUrl}/checkout/cancelled?order=${params.orderNumber}`,
      metadata: { orderNumber: params.orderNumber },
    });

    return {
      paymentStatus: "pending",
      providerReference: session.id,
      redirectUrl: session.url || undefined,
    };
  },
};
