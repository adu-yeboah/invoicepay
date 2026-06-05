import { Invoice } from "./invoice";

export interface Client {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  invoices_count?: number;
  invoices?: Invoice[];
  created_at: string;
  updated_at: string;
}
