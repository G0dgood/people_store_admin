import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface OrderItem {
    product: any;
    quantity: number;
    price: number;
}

export interface OrderRecord {
    _id: string;
    orderId: string;
    customer: any;
    items: OrderItem[];
    totalAmount: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
    paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
}

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<ApiResponse<{ orders: OrderRecord[], pagination: any }>, { page?: number, limit?: number, status?: string, search?: string }>({
            query: (params) => ({
                url: '/orders/all',
                params
            }),
            providesTags: (result) => 
                result ? [
                    ...result.data.orders.map(({ _id }) => ({ type: 'Order' as const, id: _id })),
                    { type: 'Order', id: 'LIST' }
                ] : [{ type: 'Order', id: 'LIST' }],
        }),
        getOrderById: builder.query<ApiResponse<OrderRecord>, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        updateOrderStatus: builder.mutation<ApiResponse<OrderRecord>, { id: string, status?: string, paymentStatus?: string }>({
            query: ({ id, ...body }) => ({
                url: `/orders/status/${id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Order', id },
                { type: 'Order', id: 'LIST' },
                { type: 'Order', id: 'STATS' }
            ],
        }),
        getOrderStats: builder.query<ApiResponse<{ 
            totalOrders: number, 
            totalRevenue: number, 
            pendingOrders: number, 
            processingOrders: number,
            completedOrders: number,
            cancelledOrders: number
        }>, void>({
            query: () => '/orders/stats',
            providesTags: [{ type: 'Order', id: 'STATS' }],
        }),
        getRevenueHistory: builder.query<ApiResponse<any[]>, void>({
            query: () => '/orders/revenue-history',
            providesTags: [{ type: 'Order', id: 'STATS' }], // Using STATS tag for simplicity
        }),
        getFunnelStats: builder.query<ApiResponse<any[]>, void>({
            query: () => '/orders/funnel-stats',
            providesTags: [{ type: 'Order', id: 'STATS' }],
        }),
        getMarketIntelligence: builder.query<ApiResponse<{ trafficSources: any[], regions: any[] }>, void>({
            query: () => '/orders/market-intelligence',
            providesTags: [{ type: 'Order', id: 'STATS' }],
        }),
        getMyOrders: builder.query<ApiResponse<{ orders: OrderRecord[], pagination: any }>, { page?: number, limit?: number, status?: string }>({
            query: (params) => ({
                url: '/orders/my-orders',
                params
            }),
            providesTags: (result) => 
                result ? [
                    ...result.data.orders.map(({ _id }) => ({ type: 'Order' as const, id: _id })),
                    { type: 'Order', id: 'LIST' }
                ] : [{ type: 'Order', id: 'LIST' }],
        }),
        createOrder: builder.mutation<ApiResponse<OrderRecord>, any>({
            query: (data) => ({
                url: '/orders/create',
                method: 'POST',
                body: data
            }),
            invalidatesTags: [{ type: 'Order', id: 'LIST' }, { type: 'Order', id: 'STATS' }],
        }),
        deleteOrder: builder.mutation<ApiResponse<{}>, string>({
            query: (id) => ({
                url: `/orders/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Order', id },
                { type: 'Order', id: 'LIST' },
                { type: 'Order', id: 'STATS' }
            ],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetOrdersQuery,
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useUpdateOrderStatusMutation,
    useGetOrderStatsQuery,
    useGetRevenueHistoryQuery,
    useGetFunnelStatsQuery,
    useGetMarketIntelligenceQuery,
    useCreateOrderMutation,
    useDeleteOrderMutation
} = orderApi;
