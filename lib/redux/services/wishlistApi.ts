import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface Wishlist {
  _id: string;
  customer: string;
  products: any[];
}

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<ApiResponse<Wishlist>, void>({
      query: () => ({
        url: '/wishlist',
        method: 'GET',
      }),
      providesTags: ['Wishlist'],
    }),
    toggleWishlistItem: builder.mutation<ApiResponse<Wishlist>, string>({
      query: (productId) => ({
        url: `/wishlist/toggle/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    clearWishlist: builder.mutation<ApiResponse<any>, void>({
      query: () => ({
        url: '/wishlist/clear',
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetWishlistQuery,
  useToggleWishlistItemMutation,
  useClearWishlistMutation,
} = wishlistApi;
