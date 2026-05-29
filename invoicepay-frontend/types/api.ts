/** Generic paginated response from Laravel */
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  message: string;
  [key: string]: T | string;
}

/** Error shape returned by the Laravel API */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
