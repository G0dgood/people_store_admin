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
    getProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => '/v1/products',
      providesTags: ['Product'],
    }),
    getProductById: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/v1/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    addProduct: builder.mutation<ApiResponse<Product>, FormData>({
      query: (formData) => ({
        url: '/v1/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<ApiResponse<Product>, { productId: string; data: Partial<Product> }>({
      query: ({ productId, data }) => ({
        url: `/v1/products/${productId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }, 'Product'],
    }),
    deleteProduct: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/v1/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
