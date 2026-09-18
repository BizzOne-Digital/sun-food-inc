import { PaymentInitParams, PaymentInitResult, PaymentProvider } from "./types";

/**
 * Placeholder "pay on delivery / manual bank transfer" provider.
 * No real payment credentials are used. Swap this out for a real
 * gateway (Stripe, etc.) later by implementing PaymentProvider and
 * updating getPaymentProvider() below.
 */
export const manualProvider: PaymentProvider = {
  name: "manual",
  async initPayment(_params: PaymentInitParams): Promise<PaymentInitResult> {
    return {
      paymentStatus: "pending",
      providerReference: `MANUAL-${Date.now()}`,
    };
  },
};

export function getPaymentProvider(): PaymentProvider {
  return manualProvider;
}
