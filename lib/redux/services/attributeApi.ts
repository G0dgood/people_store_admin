import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface AttributeItem {
  _id: string;
  name: string;
  subAttributes: string[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttributes: builder.query<ApiResponse<AttributeItem[]>, void>({
      query: () => '/attributes',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Attribute' as const, id: _id })),
              { type: 'Attribute', id: 'LIST' },
            ]
          : [{ type: 'Attribute', id: 'LIST' }],
    }),
    createAttribute: builder.mutation<ApiResponse<AttributeItem>, Partial<AttributeItem>>({
      query: (body) => ({
        url: '/attributes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Attribute', id: 'LIST' }],
    }),
    updateAttribute: builder.mutation<ApiResponse<AttributeItem>, { attributeId: string; body: Partial<AttributeItem> }>({
      query: ({ attributeId, body }) => ({
        url: `/attributes/${attributeId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { attributeId }) => [
        { type: 'Attribute' as const, id: attributeId },
        { type: 'Attribute', id: 'LIST' },
      ],
    }),
    deleteAttribute: builder.mutation<ApiResponse<{}>, string>({
      query: (attributeId) => ({
        url: `/attributes/${attributeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Attribute', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAttributesQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} = attributeApi;
