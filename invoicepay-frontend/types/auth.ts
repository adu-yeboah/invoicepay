export interface User {
  id: number;
  email: string;
  name?: string;
  business_logo?: string;
  phone?: string
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}
