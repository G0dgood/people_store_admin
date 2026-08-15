import { baseApi } from '../baseApi';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';

export const boutiqueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  useValidateCouponMutation
} = boutiqueApi;
