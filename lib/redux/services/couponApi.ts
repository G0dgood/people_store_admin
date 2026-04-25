import { baseApi } from '../baseApi';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';

export interface Coupon {
  _id: string;
  code: string;
  discount: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  image?: string;
  usageLimit?: number;
  minAmount?: string;
  bgColor?: string;
  createdAt: string;
  updatedAt: string;
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<PaginatedResponse<Coupon[]>, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: '/coupons',
        params: params || {},
      }),
      providesTags: ['Coupon'],
    }),
    getCouponById: builder.query<ApiResponse<Coupon>, string>({
      query: (id) => `/coupons/${id}`,
      providesTags: (result, error, id) => [{ type: 'Coupon', id }],
    }),
    createCoupon: builder.mutation<ApiResponse<Coupon>, Partial<Coupon>>({
      query: (newCoupon) => ({
        url: '/coupons',
        method: 'POST',
        body: newCoupon,
      }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation<ApiResponse<Coupon>, { id: string; data: Partial<Coupon> }>({
      query: ({ id, data }) => ({
        url: `/coupons/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Coupon', id }, 'Coupon'],
    }),
    deleteCoupon: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
