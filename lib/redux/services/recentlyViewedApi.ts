import { baseApi } from "../baseApi";
import { Product } from "./productApi";

export interface RecentlyViewedRecord {
    _id: string;
    customer: string;
    products: Product[];
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export const recentlyViewedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentlyViewed: builder.query<ApiResponse<RecentlyViewedRecord>, void>({
      query: () => "/recently-viewed",
      providesTags: ['RecentlyViewed'],
    }),
    addToRecentlyViewed: builder.mutation<ApiResponse<RecentlyViewedRecord>, string>({
      query: (productId) => ({
        url: "/recently-viewed/add",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ['RecentlyViewed'],
    }),
  }),
});

export const {
  useGetRecentlyViewedQuery,
  useAddToRecentlyViewedMutation,
} = recentlyViewedApi;
