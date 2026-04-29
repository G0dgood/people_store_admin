import { baseApi } from '../baseApi';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';

export interface GiftBox {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  products: any[];
  status: string;
  tag?: string;
  createdAt: string;
  updatedAt: string;
}

export const giftBoxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGiftBoxes: builder.query<ApiResponse<{ giftBoxes: GiftBox[], total: number, page: number, limit: number }>, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: '/gift-boxes',
        params: params || {},
      }),
      providesTags: ['GiftBox'],
    }),
    getGiftBoxById: builder.query<ApiResponse<GiftBox>, string>({
      query: (id) => `/gift-boxes/${id}`,
      providesTags: (result, error, id) => [{ type: 'GiftBox', id }],
    }),
    createGiftBox: builder.mutation<ApiResponse<GiftBox>, Partial<GiftBox>>({
      query: (data) => ({
        url: '/gift-boxes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GiftBox'],
    }),
    updateGiftBox: builder.mutation<ApiResponse<GiftBox>, { id: string; data: Partial<GiftBox> }>({
      query: ({ id, data }) => ({
        url: `/gift-boxes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'GiftBox', id }, 'GiftBox'],
    }),
    deleteGiftBox: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/gift-boxes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GiftBox'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetGiftBoxesQuery,
  useGetGiftBoxByIdQuery,
  useCreateGiftBoxMutation,
  useUpdateGiftBoxMutation,
  useDeleteGiftBoxMutation,
} = giftBoxApi;
