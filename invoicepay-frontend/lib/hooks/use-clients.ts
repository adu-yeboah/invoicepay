import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Client } from "@/types/client";
import { toast } from "sonner";

/** GET /clients — list all clients */
export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data } = await api.get<{ message: string; clients: Client[] }>(
        "/clients"
      );
      return data.clients;
    },
  });
}

/** GET /clients/:id — single client with invoices */
export function useClient(id: number | null) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data } = await api.get<{ message: string; client: Client }>(
        `/clients/${id}`
      );
      return data.client;
    },
    enabled: !!id,
  });
}

/** POST /clients — create a client */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      phone?: string;
      address?: string;
    }) => {
      const { data } = await api.post<{ message: string; client: Client }>(
        "/clients",
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(data.message || "Client created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create client"
      );
    },
  });
}

/** PUT /clients/:id — update a client */
export function useUpdateClient(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    }) => {
      const { data } = await api.put<{ message: string; client: Client }>(
        `/clients/${id}`,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["client", id] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(data.message || "Client updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update client"
      );
    },
  });
}

/** DELETE /clients/:id — delete a client */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<{ message: string }>(
        `/clients/${id}`
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(data.message || "Client deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete client"
      );
    },
  });
}
