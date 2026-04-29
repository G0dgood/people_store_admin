import { ReactNode } from 'react';
import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface TicketResponse {
    sender: string;
    senderId?: string;
    message: string;
    attachments?: string[];
    timestamp: string;
}

export interface SupportTicket {
    activity: ReactNode;
    customer: ReactNode;
    _id: string;
    ticketId: string;
    customerName: string;
    customerEmail: string;
    subject: string;
    message: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
    responses: TicketResponse[];
    owner?: any;
    assignedTo?: any;
    lastActivity: string;
    createdAt: string;
    updatedAt: string;
}

export const ticketApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTickets: builder.query<ApiResponse<{ tickets: SupportTicket[], pagination: { total: number, page: number, limit: number, totalPages: number } }>, { status?: string; priority?: string; search?: string, page?: number, limit?: number } | void>({
            query: (params) => ({
                url: '/tickets',
                params: params || undefined,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.tickets.map(({ _id }) => ({ type: 'Ticket' as const, id: _id })),
                        { type: 'Ticket', id: 'LIST' },
                    ]
                    : [{ type: 'Ticket', id: 'LIST' }],
        }),
        getTicketById: builder.query<ApiResponse<SupportTicket>, string>({
            query: (id) => `/tickets/${id}`,
            providesTags: (result, error, id) => [{ type: 'Ticket', id }],
        }),
        createTicket: builder.mutation<ApiResponse<SupportTicket>, Partial<SupportTicket>>({
            query: (body) => ({
                url: '/tickets',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
        }),
        updateTicket: builder.mutation<ApiResponse<SupportTicket>, { id: string; body: Partial<SupportTicket> }>({
            query: ({ id, body }) => ({
                url: `/tickets/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Ticket', id },
                { type: 'Ticket', id: 'LIST' }
            ],
        }),
        addTicketResponse: builder.mutation<ApiResponse<SupportTicket>, { id: string; body: { message: string; sender?: string; attachments?: string[] } }>({
            query: ({ id, body }) => ({
                url: `/tickets/${id}/respond`,
                method: 'POST',
                body,
            }),
            async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
                // Optimistically update the single ticket detail
                const patchResult = dispatch(
                    ticketApi.util.updateQueryData('getTicketById', id, (draft) => {
                        if (draft.data) {
                            draft.data.responses.push({
                                message: body.message || "",
                                sender: body.sender || "Admin",
                                attachments: body.attachments || [],
                                timestamp: new Date().toISOString(),
                            });
                            draft.data.status = body.sender === "Admin" ? "Pending" : "Open";
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }],
        }),
        deleteTicket: builder.mutation<ApiResponse<{}>, string>({
            query: (id) => ({
                url: `/tickets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetTicketsQuery,
    useGetTicketByIdQuery,
    useCreateTicketMutation,
    useUpdateTicketMutation,
    useAddTicketResponseMutation,
    useDeleteTicketMutation,
} = ticketApi;
