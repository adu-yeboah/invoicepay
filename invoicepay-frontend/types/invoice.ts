export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
}

export interface Invoice {
  id: number;
  user_id: number;
  client_id: number;
  invoice_number: string;
  title: string | null;
  notes: string | null;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  public_token: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;

  /** Nested relations returned by the API */
  client?: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
  items?: InvoiceItem[];
  payments?: Payment[];
}

import { Payment } from "./payment";

export interface InvoiceCreatePayload {
  client_id: number;
  title?: string;
  notes?: string;
  issue_date: string;
  due_date: string;
  tax_rate?: number;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface InvoiceUpdatePayload extends Partial<InvoiceCreatePayload> {}
