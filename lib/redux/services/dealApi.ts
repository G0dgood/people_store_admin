import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface DealRecord {
    image: any;
    name: any;
    id: any;
    _id: string;
    product: any;
    discount: number;
    type: 'deal' | 'timer';
    timer?: {
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
        isRunning: boolean;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

export const dealApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDeals: builder.query<ApiResponse<{ deals: DealRecord[], pagination: any }>, { page?: number; limit?: number } | void>({
            query: (params) => ({
                url: '/deals/all',
                params: params || {},
            }),
            providesTags: (result) => 
                result?.data?.deals ? [
                    ...result.data.deals.map(({ _id }) => ({ type: 'Deal' as const, id: _id })),
                    { type: 'Deal', id: 'LIST' }
                ] : [{ type: 'Deal', id: 'LIST' }],
        }),
        getTimer: builder.query<ApiResponse<DealRecord>, void>({
            query: () => '/deals/timer',
            providesTags: [{ type: 'Deal', id: 'TIMER' }],
        }),
        updateTimer: builder.mutation<ApiResponse<DealRecord>, { days: string, hours: string, minutes: string, seconds: string, isRunning: boolean }>({
            query: (body) => ({
                url: '/deals/timer',
                method: 'PATCH',
                body
            }),
            invalidatesTags: [{ type: 'Deal', id: 'TIMER' }],
        }),
        createOrUpdateOffer: builder.mutation<ApiResponse<DealRecord>, { productId: string, discount: number }>({
            query: (body) => ({
                url: '/deals/offer',
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'Deal', id: 'LIST' }],
        }),
        deleteOffer: builder.mutation<ApiResponse<{}>, string>({
            query: (id) => ({
                url: `/deals/offer/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Deal', id: 'LIST' }],
        }),
        getDealStats: builder.query<ApiResponse<{ activeDeals: number, totalViewed: number, conversionRate: string, offerRevenue: number }>, void>({
            query: () => '/deals/stats',
            providesTags: [{ type: 'Deal', id: 'LIST' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetDealsQuery,
    useGetTimerQuery,
    useUpdateTimerMutation,
    useCreateOrUpdateOfferMutation,
    useDeleteOfferMutation,
    useGetDealStatsQuery
} = dealApi;
