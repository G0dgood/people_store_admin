import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface RefundRequest {
    _id: string;
    refundId: string;
    order: any;
    customer: any;
    amount: number;
    reason: string;
    description: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Completed';
    images: string[];
    adminNote?: string;
    processedBy?: any;
    processedAt?: string;
    createdAt: string;
    updatedAt: string;
    history?: {
        status: string;
        message: string;
        timestamp: string;
        adminNote?: string;
        processedBy?: any;
    }[];
}

export const refundApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRefunds: builder.query<ApiResponse<{ refunds: RefundRequest[], pagination: { total: number, page: number, limit: number, totalPages: number } }>, { status?: string; search?: string, page?: number, limit?: number } | void>({
            query: (params) => ({
                url: '/refunds',
                params: params || undefined,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.refunds.map(({ _id }) => ({ type: 'Refund' as const, id: _id })),
                        { type: 'Refund', id: 'LIST' },
                    ]
                    : [{ type: 'Refund', id: 'LIST' }],
        }),
        getRefundById: builder.query<ApiResponse<RefundRequest>, string>({
            query: (id) => `/refunds/${id}`,
            providesTags: (result, error, id) => [{ type: 'Refund', id }],
        }),
        getRefundStats: builder.query<ApiResponse<{ totalRefunds: number, totalAmount: number, pendingCount: number, completedCount: number, approvedCount: number, rejectedCount: number }>, void>({
            query: () => '/refunds/stats',
            providesTags: [{ type: 'Refund', id: 'STATS' }],
        }),
        requestRefund: builder.mutation<ApiResponse<RefundRequest>, any>({
            query: (body) => ({
                url: '/refunds/request',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Refund', id: 'LIST' }, { type: 'Refund', id: 'STATS' }],
        }),
        updateRefundStatus: builder.mutation<ApiResponse<RefundRequest>, { id: string; body: { status: string; adminNote?: string } }>({
            query: ({ id, body }) => ({
                url: `/refunds/${id}/status`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Refund', id },
                { type: 'Refund', id: 'LIST' },
                { type: 'Refund', id: 'STATS' }
            ],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetRefundsQuery,
    useGetRefundByIdQuery,
    useGetRefundStatsQuery,
    useRequestRefundMutation,
    useUpdateRefundStatusMutation,
} = refundApi;
