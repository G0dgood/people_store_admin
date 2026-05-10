import { ApiResponse } from '@/lib/types/api';
import { baseApi } from '../baseApi';

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerCustomer: builder.mutation({
      query: (userData) => {
        const formData = new FormData();
        formData.append('fullName', userData.fullName);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        if (userData.avatar) {
          formData.append('avatar', userData.avatar);
        }
        return {
          url: '/customers/register',
          method: 'POST',
          body: formData,
        };
      },
    }),
    loginCustomer: builder.mutation({
      query: (credentials) => ({
        url: '/customers/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    socialLoginCustomer: builder.mutation({
      query: (data) => ({
        url: '/customers/social-login',
        method: 'POST',
        body: data,
      }),
    }),
    updateCustomerAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return {
          url: '/customers/avatar',
          method: 'PATCH',
          body: formData,
        };
      },
    }),
    getCurrentCustomer: builder.query<any, void>({
      query: () => ({
        url: '/customers/current-customer',
        method: 'GET',
      }),
      providesTags: ['Customers'],
    }),
    updateCustomerProfile: builder.mutation({
      query: (data) => ({
        url: '/customers/update-profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Customers'],
    }),
    getAllCustomers: builder.query<ApiResponse<{ customers: any[], pagination: any }>, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: '/customers',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['Customers'],
    }),
    logoutCustomer: builder.mutation<any, void>({
      query: () => ({
        url: '/customers/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Customers'],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/delete-account/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customers'],
    }),
    getCustomerStats: builder.query<any, string | void>({
      query: (range) => ({
        url: `/customers/stats${range ? `?range=${range}` : ""}`,
        method: 'GET',
      }),
      providesTags: ['Customers'],
    }),
    toggleCustomerStatus: builder.mutation<ApiResponse<any>, { id: string, status: 'active' | 'deactivated' }>({
      query: ({ id, status }) => ({
        url: `/customers/status/${id}`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: ['Customers'],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useRegisterCustomerMutation,
  useLoginCustomerMutation,
  useSocialLoginCustomerMutation,
  useUpdateCustomerAvatarMutation,
  useGetCurrentCustomerQuery,
  useUpdateCustomerProfileMutation,
  useLogoutCustomerMutation,
  useGetAllCustomersQuery,
  useDeleteCustomerMutation,
  useGetCustomerStatsQuery,
  useToggleCustomerStatusMutation
} = customerApi;
