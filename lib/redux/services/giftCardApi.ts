import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface GiftCard {
  recipientEmail: string;
  message: string;
  recipientName: string;
  _id: string;
  name: string;
  code: string;
  balance: number;
  initialAmount: number;
  expiryDate?: string;
  status: 'Active' | 'Inactive' | 'Used' | 'Expired';
  color?: string;
  customer?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const giftCardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGiftCards: builder.query<ApiResponse<{ giftCards: GiftCard[], total: number, page: number, limit: number }>, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: '/gift-cards',
        params: params || {},
      }),
      providesTags: ['GiftCard'],
    }),
    getGiftCardById: builder.query<ApiResponse<GiftCard>, string>({
      query: (id) => `/gift-cards/${id}`,
      providesTags: (result, error, id) => [{ type: 'GiftCard', id }],
    }),
    createGiftCard: builder.mutation<ApiResponse<GiftCard>, Partial<GiftCard>>({
      query: (data) => ({
        url: '/gift-cards',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GiftCard'],
    }),
    updateGiftCard: builder.mutation<ApiResponse<GiftCard>, { id: string; data: Partial<GiftCard> }>({
      query: ({ id, data }) => ({
        url: `/gift-cards/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'GiftCard', id }, 'GiftCard'],
    }),
    deleteGiftCard: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/gift-cards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GiftCard'],
    }),
    buyGiftCard: builder.mutation<ApiResponse<GiftCard>, { amount: number; name?: string; color?: string; recipientName?: string; recipientEmail?: string; message?: string }>({
      query: (data) => ({
        url: '/gift-cards/buy',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GiftCard'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetGiftCardsQuery,
  useGetGiftCardByIdQuery,
  useCreateGiftCardMutation,
  useUpdateGiftCardMutation,
  useDeleteGiftCardMutation,
  useBuyGiftCardMutation,
} = giftCardApi;
