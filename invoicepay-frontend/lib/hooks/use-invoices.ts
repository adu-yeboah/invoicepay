import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Invoice, InvoiceCreatePayload, InvoiceUpdatePayload } from "@/types/invoice";
import { PaginatedResponse } from "@/types/api";
import { toast } from "sonner";

export interface InvoiceFilters {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
}

/** GET /invoices — list with filters */
export function useInvoices(filters: InvoiceFilters = {}) {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      if (filters.page) params.set("page", String(filters.page));

      const { data } = await api.get<PaginatedResponse<Invoice>>(
        `/invoices?${params.toString()}`
      );
      return data;
    },
  });
}

/** GET /invoices/:id — single invoice with relations */
export function useInvoice(id: number | null) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const { data } = await api.get<{ message: string; invoice: Invoice }>(
        `/invoices/${id}`
      );
      return data.invoice;
    },
    enabled: !!id,
  });
}

/** POST /invoices — create invoice */
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InvoiceCreatePayload) => {
      const { data } = await api.post<{
        message: string;
        invoice: Invoice;
      }>("/invoices", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(data.message || "Invoice created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create invoice"
      );
    },
  });
}

/** PUT /invoices/:id — update draft invoice */
export function useUpdateInvoice(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InvoiceUpdatePayload) => {
      const { data } = await api.put<{
        message: string;
        invoice: Invoice;
      }>(`/invoices/${id}`, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(data.message || "Invoice updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update invoice"
      );
    },
  });
}

/** DELETE /invoices/:id — delete draft/cancelled invoice */
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<{ message: string }>(
        `/invoices/${id}`
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(data.message || "Invoice deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete invoice"
      );
    },
  });
}

/** POST /invoices/:id/send — send invoice to client */
export function useSendInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<{
        message: string;
        payment_link: string;
        invoice: Invoice;
      }>(`/invoices/${id}/send`);
      return data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(data.message || "Invoice sent successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send invoice"
      );
    },
  });
}

/** POST /invoices/:id/mark-paid — manually mark as paid */
export function useMarkPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<{
        message: string;
        invoice: Invoice;
      }>(`/invoices/${id}/mark-paid`);
      return data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(data.message || "Invoice marked as paid");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to mark as paid"
      );
    },
  });
}
