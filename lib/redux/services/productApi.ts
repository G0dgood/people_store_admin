import { ReactNode } from 'react';
import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface ProductMedia {
  url: string;
  type: 'image' | 'video';
  _id?: string;
}

export interface CategoryRef {
  _id: string;
  name: string;
  image?: string;
}

export interface Product {
  brand: any;
  gender: string;
  volume: string;
  size: string;
  sku: ReactNode;
  image: string | Blob | undefined;
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: CategoryRef;
  tags: string[];
  colors: string[];
  stock: number;
  stockStatus: string;
  isUnlimited: boolean;
  isFeatured: boolean;
  status: 'Draft' | 'Published';
  taxIncluded: boolean;
  expiryStart?: string | null;
  expiryEnd?: string | null;
  productImage: string;
  media: ProductMedia[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponse<{ products: Product[], pagination: any }>, { limit?: number, category?: string, search?: string, page?: number, status?: string, brand?: string } | void>({
      query: (params) => ({
        url: '/products',
        params: params || {}
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    addProduct: builder.mutation<ApiResponse<Product>, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Product', 'Brand', 'Category'],
    }),
    updateProduct: builder.mutation<ApiResponse<Product>, { productId: string; data: Partial<Product> }>({
      query: ({ productId, data }) => ({
        url: `/products/${productId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId }, 
        'Product',
        'Brand',
        'Category'
      ],
    }),
    deleteProduct: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'Brand', 'Category'],
    }),
    getBestSellingProducts: builder.query<ApiResponse<any[]>, void>({
      query: () => '/products/best-selling',
      providesTags: ['Product'],
    }),
    getProductStats: builder.query<ApiResponse<{ totalProducts: number, stockProducts: number, outOfStock: number }>, void>({
      query: () => '/products/stats',
      providesTags: ['Product'],
    }),
    getRecommendedProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => '/products/recommended',
      providesTags: ['Product'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetBestSellingProductsQuery,
  useGetProductStatsQuery,
  useGetRecommendedProductsQuery,
} = productApi;
