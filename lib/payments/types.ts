export interface PaymentInitParams {
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
}

export interface PaymentInitResult {
  paymentStatus: "pending" | "paid" | "failed";
  providerReference?: string;
  redirectUrl?: string;
}

export interface PaymentProvider {
  name: string;
  initPayment(params: PaymentInitParams): Promise<PaymentInitResult>;
}
