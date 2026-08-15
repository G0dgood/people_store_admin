import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface ReviewRecord {
    _id: string;
    product: any;
    customer: any;
    rating: number;
    comment: string;
    status: 'Pending' | 'Published' | 'Spam';
    reply?: {
        comment: string;
        date: string;
    };
    helpfulBy?: string[];
    helpfulCount?: number;
    createdAt: string;
    updatedAt: string;
}

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReviews: builder.query<ApiResponse<{ reviews: ReviewRecord[], pagination: any }>, { page?: number, limit?: number, status?: string, search?: string }>({
            query: (params) => ({
                url: '/reviews/all',
                params
            }),
            providesTags: (result) => 
                result ? [
                    ...result.data.reviews.map(({ _id }) => ({ type: 'Review' as const, id: _id })),
                    { type: 'Review', id: 'LIST' }
                ] : [{ type: 'Review', id: 'LIST' }],
        }),
        updateReviewStatus: builder.mutation<ApiResponse<ReviewRecord>, { id: string, status: string }>({
            query: ({ id, status }) => ({
                url: `/reviews/status/${id}`,
                method: 'PATCH',
                body: { status }
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Review', id }, { type: 'Review', id: 'LIST' }],
        }),
        replyToReview: builder.mutation<ApiResponse<ReviewRecord>, { id: string, comment: string }>({
            query: ({ id, comment }) => ({
                url: `/reviews/reply/${id}`,
                method: 'POST',
                body: { comment }
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Review', id }, { type: 'Review', id: 'LIST' }],
        }),
        deleteReview: builder.mutation<ApiResponse<{}>, string>({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Review', id: 'LIST' }],
        }),
        bulkReviewAction: builder.mutation<ApiResponse<{}>, { ids: string[], action: string, status?: string }>({
            query: (body) => ({
                url: '/reviews/bulk',
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'Review', id: 'LIST' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetReviewsQuery,
    useUpdateReviewStatusMutation,
    useReplyToReviewMutation,
    useDeleteReviewMutation,
    useBulkReviewActionMutation,
} = reviewApi;
