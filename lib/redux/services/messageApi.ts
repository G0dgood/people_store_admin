import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface DirectMessage {
    _id: string;
    sender: any;
    senderModel: 'User' | 'Customer';
    receiver: any;
    receiverModel: 'User' | 'Customer';
    message: string;
    attachments: string[];
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedMessages {
    messages: DirectMessage[];
    page: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
}

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChatHistory: builder.query<ApiResponse<PaginatedMessages>, string>({
            query: (otherId) => `/messages/history/${otherId}`,
            providesTags: (result, error, otherId) => [{ type: 'Message' as const, id: otherId }],
        }),
        sendMessage: builder.mutation<ApiResponse<DirectMessage>, { receiverId: string, receiverModel: string, message: string, attachments?: string[] }>({
            query: (data) => ({
                url: '/messages/send',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { receiverId }) => [{ type: 'Message', id: receiverId }],
        }),
        getUnreadCount: builder.query<ApiResponse<{ count: number }>, void>({
            query: () => '/messages/unread-count',
            providesTags: [{ type: 'Message', id: 'UNREAD' }],
        }),
        markRead: builder.mutation<ApiResponse<{ modifiedCount: number }>, { senderId: string }>({
            query: (data) => ({
                url: '/messages/read',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: [{ type: 'Message', id: 'UNREAD' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetChatHistoryQuery,
    useSendMessageMutation,
    useGetUnreadCountQuery,
    useMarkReadMutation,
} = messageApi;
