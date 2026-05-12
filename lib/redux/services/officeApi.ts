import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface Office {
  _id: string;
  name: string;
  subdomain?: string;
  address: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export const officeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOffices: builder.query<ApiResponse<Office[]>, void>({
      query: () => '/offices',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Office' as const, id: _id })),
              { type: 'Office', id: 'LIST' }
            ]
          : [{ type: 'Office', id: 'LIST' }],
    }),
    createOffice: builder.mutation<ApiResponse<Office>, Partial<Office>>({
      query: (body) => ({
        url: '/offices/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Office', id: 'LIST' }],
    }),
    updateOffice: builder.mutation<ApiResponse<Office>, { id: string; body: Partial<Office> }>({
      query: ({ id, body }) => ({
        url: `/offices/update/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Office', id },
        { type: 'Office', id: 'LIST' }
      ],
    }),
    deleteOffice: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/offices/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Office', id: 'LIST' }],
    }),
    getOfficeBySubdomain: builder.query<ApiResponse<Office>, string>({
      query: (subdomain) => `/offices/subdomain/${subdomain}`,
      providesTags: (result, error, subdomain) => [{ type: 'Office', id: subdomain }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetOfficesQuery,
  useCreateOfficeMutation,
  useUpdateOfficeMutation,
  useDeleteOfficeMutation,
  useGetOfficeBySubdomainQuery,
} = officeApi;
