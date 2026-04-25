import { baseApi } from '../baseApi';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';

export interface Brand {
  _id: string;
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
    createBrand: builder.mutation<ApiResponse<Brand>, Partial<Brand>>({
      query: (data) => ({
        url: '/brands',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Brand'],
    }),
    updateBrand: builder.mutation<ApiResponse<Brand>, { id: string; data: Partial<Brand> }>({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Brand', id }, 'Brand'],
    }),
    deleteBrand: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
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
