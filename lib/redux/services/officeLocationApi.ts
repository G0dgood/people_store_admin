import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';
import { Product } from './productApi';
import { Office } from './officeApi';

export const officeLocationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get office details by subdomain (Public)
    getOfficeBySubdomain: builder.query<ApiResponse<Office>, string>({
      query: (subdomain) => `/offices/subdomain/${subdomain}`,
      providesTags: (result, error, subdomain) => [{ type: 'Office', id: subdomain }],
    }),

    // Get all products assigned to a specific office
    getProductsByOffice: builder.query<ApiResponse<Product[]>, { officeId: string; category?: string; search?: string; brand?: string }>({
      query: ({ officeId, category, search, brand }) => ({
        url: `/products/office/${officeId}`,
        params: { category, search, brand }
      }),
      providesTags: (result, error, { officeId }) => [{ type: 'Product', id: `OFFICE_${officeId}` }],
    }),

    // Get product details with office-specific context
    getOfficeProductById: builder.query<ApiResponse<Product>, { productId: string; officeId?: string }>({
      query: ({ productId }) => `/products/${productId}`,
      providesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    // Get categories that have products in this office
    getOfficeCategories: builder.query<ApiResponse<any[]>, string>({
      query: (officeId) => `/products/office/${officeId}/categories`,
      providesTags: (result, error, officeId) => [{ type: 'Category', id: `OFFICE_${officeId}` }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetOfficeBySubdomainQuery,
  useGetProductsByOfficeQuery,
  useGetOfficeProductByIdQuery,
  useGetOfficeCategoriesQuery,
} = officeLocationApi;
