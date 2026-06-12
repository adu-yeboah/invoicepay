export interface Payment {
  id: number;
  invoice_id: number;
  paystack_reference: string;
  amount: number;
  currency: string;
  payment_method: string | null;
  status: "pending" | "success" | "failed";
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}
