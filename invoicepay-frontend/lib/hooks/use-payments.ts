import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export interface PublicInvoice {
  invoice_number: string;
  title: string | null;
  status: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  currency: string;
  items: {
    id: number;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
  client: {
    name: string;
    email: string;
  };
  business: {
    name: string | null;
    logo: string | null;
  };
}

/** GET /pay/:token — public invoice for payment */
export function usePublicInvoice(token: string | null) {
  return useQuery({
    queryKey: ["public-invoice", token],
    queryFn: async () => {
      const { data } = await api.get<PublicInvoice>(`/pay/${token}`);
      return data;
    },
    enabled: !!token,
    retry: false,
  });
}

/** POST /pay/:token/initiate — start Paystack payment */
export function useInitiatePayment() {
  return useMutation({
    mutationFn: async ({
      token,
    }: {
      token: string;
    }) => {
      const { data } = await api.post<{
        authorization_url: string;
        reference: string;
      }>(`/pay/${token}/initiate`);
      return data;
    },
    onSuccess: (data) => {
      // Redirect to Paystack checkout
      window.location.href = data.authorization_url;
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
    },
  });
}

/** GET /pay/:token/verify/:reference — verify payment */
export function useVerifyPayment(
  token: string | null,
  reference: string | null
) {
  return useQuery({
    queryKey: ["verify-payment", token, reference],
    queryFn: async () => {
      const { data } = await api.get<{
        status: string;
        invoice_number: string;
        amount: number;
        paid_at: string;
      }>(`/pay/${token}/verify/${reference}`);
      return data;
    },
    enabled: !!token && !!reference,
    retry: false,
  });
}
