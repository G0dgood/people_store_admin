export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
