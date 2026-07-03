import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export interface Reminder {
  id: number;
  invoice_id: number;
  type: "due_soon" | "overdue";
  sent_at: string;
  created_at: string;
}

/** POST /invoices/:id/reminders — send a reminder */
export function useSendReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invoiceId,
      type = "overdue",
    }: {
      invoiceId: number;
      type?: string;
    }) => {
      const { data } = await api.post<{ message: string }>(
        `/invoices/${invoiceId}/reminders`,
        { type }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reminders", variables.invoiceId],
      });
      toast.success(data.message || "Reminder sent successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send reminder"
      );
    },
  });
}

/** GET /invoices/:id/reminders — list reminders */
export function useReminders(invoiceId: number | null) {
  return useQuery({
    queryKey: ["reminders", invoiceId],
    queryFn: async () => {
      const { data } = await api.get<{ message: string; reminders: Reminder[] }>(
        `/invoices/${invoiceId}/reminders`
      );
      return data.reminders;
    },
    enabled: !!invoiceId,
  });
}
