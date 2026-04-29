import { baseApi } from '../baseApi';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';

export interface Brand {
  _id: string;
  id: string;
  name: string;
  logo: string;
  category: string;
  rating: number;
  status: string;
  inventoryCount: number;
  createdAt: string;
  updatedAt: string;
}

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<PaginatedResponse<Brand[]>, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: '/brands',
        params: params || {},
      }),
      providesTags: ['Brand'],
    }),
    getBrandById: builder.query<ApiResponse<Brand>, string>({
      query: (id) => `/brands/${id}`,
      providesTags: (result, error, id) => [{ type: 'Brand', id }],
    }),
    createBrand: builder.mutation({
      query: (data: Partial<Brand>) => ({
        url: '/brands',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Brand'],
    }),
    updateBrand: builder.mutation({
      query: ({ id, data }: { id: string; data: Partial<Brand> }) => ({
        url: `/brands/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Brand', id: id as any }, 'Brand'],
    }),
    deleteBrand: builder.mutation({
      query: (id: string) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
