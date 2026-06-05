import { Invoice } from "./invoice";

export interface DashboardStats {
  total_earned: number;
  outstanding: number;
  overdue_count: number;
  paid_count: number;
  total_invoices: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recent_invoices: Invoice[];
}
