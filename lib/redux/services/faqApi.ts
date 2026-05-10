import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<ApiResponse<{ faqs: FAQItem[], pagination: any }>, { page?: number; limit?: number; search?: string; category?: string } | void>({
      query: (params) => ({
        url: '/faqs',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.faqs
          ? [
              ...result.data.faqs.map(({ _id }) => ({ type: 'FAQ' as const, id: _id })),
              { type: 'FAQ', id: 'LIST' },
            ]
          : [{ type: 'FAQ', id: 'LIST' }],
    }),
    createFaq: builder.mutation<ApiResponse<FAQItem>, Partial<FAQItem>>({
      query: (body) => ({
        url: '/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'FAQ', id: 'LIST' }],
    }),
    updateFaq: builder.mutation<ApiResponse<FAQItem>, { faqId: string; body: Partial<FAQItem> }>({
      query: ({ faqId, body }) => ({
        url: `/faqs/${faqId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FAQ' as const, id: faqId }],
    }),
    deleteFaq: builder.mutation<ApiResponse<{}>, string>({
      query: (faqId) => ({
        url: `/faqs/${faqId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'FAQ', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
