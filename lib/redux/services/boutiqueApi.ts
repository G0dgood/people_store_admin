import { baseApi } from '../baseApi';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';
import { Product } from './productApi';
import { Brand } from './brandApi';
import { CategoryItem } from './categoryApi';
import { Coupon } from './couponApi';
import { AdvertConfig } from './advertApi';
import { DealRecord } from './dealApi';
import { FAQItem } from './faqApi';
import { ReviewRecord } from './reviewApi';

export const boutiqueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProducts: builder.query<ApiResponse<{ products: Product[], pagination: any }>, { limit?: number, category?: string, brand?: string, search?: string, page?: number, sort?: string, minPrice?: number, maxPrice?: number, status?: string, condition?: string, rating?: number, subCategory?: string } | void>({
      query: (params) => ({
        url: '/products',
        params: params || {}
      }),
      providesTags: ['Product'],
    }),
    getPublicProductById: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
    getPublicRelatedProducts: builder.query<ApiResponse<Product[]>, string>({
      query: (id) => `/products/related/${id}`,
      providesTags: ['Product'],
    }),
    getPublicRecommendedProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => '/products/recommended',
      providesTags: ['Product'],
    }),
    getPublicNewArrivals: builder.query<ApiResponse<{ products: Product[], pagination: any }>, { limit?: number } | void>({
      query: (params) => ({
        url: '/products',
        params: {
          sort: '-createdAt',
          limit: params?.limit || 10
        }
      }),
      providesTags: ['Product'],
    }),
    getPublicBrands: builder.query<ApiResponse<{ brands: Brand[], pagination: any }>, void>({
      query: () => '/brands',
      providesTags: ['Brand'],
    }),
    getPublicCategories: builder.query<ApiResponse<{ categories: CategoryItem[], pagination: any }>, void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getPublicCoupons: builder.query<PaginatedResponse<Coupon[]>, void>({
      query: () => '/coupons',
      providesTags: ['Coupon'],
    }),
    getPublicAdverts: builder.query<AdvertConfig[], void>({
      query: () => '/adverts',
      transformResponse: (response: ApiResponse<AdvertConfig[]>) => response.data,
      providesTags: ['Advert'],
    }),
    getPublicAdvertConfig: builder.query<AdvertConfig, void>({
      query: () => '/adverts/config',
      transformResponse: (response: ApiResponse<AdvertConfig>) => response.data,
      providesTags: ['Advert'],
    }),
    getPublicDeals: builder.query<ApiResponse<{ deals: DealRecord[], pagination: any }>, void>({
      query: () => '/deals/all',
      providesTags: ['Deal'],
    }),
    getPublicTimer: builder.query<ApiResponse<DealRecord>, void>({
      query: () => '/deals/timer',
      providesTags: ['Deal'],
    }),
    getPublicFaqs: builder.query<ApiResponse<FAQItem[]>, void>({
      query: () => '/faqs',
      providesTags: ['FAQ'],
    }),
    getPublicReviewsByProduct: builder.query<ApiResponse<ReviewRecord[]>, string>({
      query: (productId) => `/reviews/product/${productId}`,
      providesTags: (result) => 
          result ? [
              ...result.data.map(({ _id }) => ({ type: 'Review' as const, id: _id })),
              { type: 'Review', id: 'LIST' }
          ] : [{ type: 'Review', id: 'LIST' }],
    }),
    submitReview: builder.mutation<ApiResponse<ReviewRecord>, FormData>({
      query: (formData) => ({
          url: '/reviews',
          method: 'POST',
          body: formData
      }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
    validateCoupon: builder.mutation<ApiResponse<any>, { code: string, subtotal: number }>({
      query: (body) => ({
        url: '/coupons/validate',
        method: 'POST',
        body
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPublicProductsQuery,
  useGetPublicProductByIdQuery,
  useGetPublicRelatedProductsQuery,
  useGetPublicRecommendedProductsQuery,
  useGetPublicNewArrivalsQuery,
  useGetPublicBrandsQuery,
  useGetPublicCategoriesQuery,
  useGetPublicCouponsQuery,
  useGetPublicAdvertsQuery,
  useGetPublicAdvertConfigQuery,
  useGetPublicDealsQuery,
  useGetPublicTimerQuery,
  useGetPublicFaqsQuery,
  useGetPublicReviewsByProductQuery,
  useSubmitReviewMutation,
  useValidateCouponMutation
} = boutiqueApi;
