import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DashboardResponse } from "@/types/dashboard";

/** GET /dashboard — stats + recent invoices */
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get<DashboardResponse>("/dashboard");
      return data;
    },
  });
}
