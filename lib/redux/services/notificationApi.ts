import { baseApi } from '../baseApi';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';

export interface NotificationItem {
  _id: string;
  title: string;
  description: string;
  type: "Orders" | "Stock" | "Security" | "General";
  isRead: boolean;
  actor: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PaginatedResponse<NotificationItem[]>, { page?: number; limit?: number; type?: string; isRead?: boolean } | void>({
      query: (params) => ({
        url: '/notifications',
        params: params || {},
      }),
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<ApiResponse<{}>, { ids: string[] }>({
      query: (body) => ({
        url: '/notifications/mark-read',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<ApiResponse<{}>, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotifications: builder.mutation<ApiResponse<{}>, { ids: string[] }>({
      query: (body) => ({
        url: '/notifications/bulk-delete',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Notification'],
    }),
    clearHistory: builder.mutation<ApiResponse<{}>, void>({
      query: () => ({
        url: '/notifications/clear-history',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    createNotification: builder.mutation<ApiResponse<NotificationItem>, Partial<NotificationItem>>({
      query: (body) => ({
        url: '/notifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationsMutation,
  useClearHistoryMutation,
  useCreateNotificationMutation,
} = notificationApi;
