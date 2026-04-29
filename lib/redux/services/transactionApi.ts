import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface TransactionRecord {
				custId(custId: any): void;
    _id: string;
    transactionId: string;
    order: any;
    customer: any;
    amount: number;
    paymentMethod: string;
    status: 'Pending' | 'Success' | 'Failed' | 'Reversed';
    providerReference: string;
    currency: string;
    paymentGateway: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
}

export const transactionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query<ApiResponse<{ transactions: TransactionRecord[], pagination: { total: number, page: number, limit: number, totalPages: number } }>, { status?: string; page?: number, limit?: number } | void>({
            query: (params) => ({
                url: '/transactions',
                params: params || undefined,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.transactions.map(({ _id }) => ({ type: 'Transaction' as const, id: _id })),
                        { type: 'Transaction', id: 'LIST' },
                    ]
                    : [{ type: 'Transaction', id: 'LIST' }],
        }),
        getTransactionById: builder.query<ApiResponse<TransactionRecord>, string>({
            query: (id) => `/transactions/${id}`,
            providesTags: (result, error, id) => [{ type: 'Transaction', id }],
        }),
        getTransactionStats: builder.query<ApiResponse<{ totalRevenue: number, transactionCount: number, successCount: number, failedCount: number, pendingCount: number }>, void>({
            query: () => '/transactions/stats',
            providesTags: [{ type: 'Transaction', id: 'STATS' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetTransactionsQuery,
    useGetTransactionByIdQuery,
    useGetTransactionStatsQuery,
} = transactionApi;
