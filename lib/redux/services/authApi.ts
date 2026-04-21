import { baseApi } from '../baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/v1/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/v1/users/logout',
        method: 'POST',
      }),
    }),
    getUsers: builder.query<{ users: any[], pagination: any }, { page?: number, limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/v1/users?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ _id }: any) => ({ type: 'User' as const, id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => ({
        url: '/v1/users/current-user',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateAccount: builder.mutation({
      query: (details) => ({
        url: '/v1/users/update-account',
        method: 'PATCH',
        body: details,
      }),
      invalidatesTags: ['User'],
    }),
    updateAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return {
          url: '/v1/users/avatar',
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: '/v1/users/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),
    onboardUser: builder.mutation({
      query: (userData) => ({
        url: '/v1/users/onboard',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateStaff: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/v1/users/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' }
      ],
    }),
    deleteStaff: builder.mutation({
      query: (userId) => ({
        url: `/v1/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useGetUsersQuery,
  useGetCurrentUserQuery,
  useUpdateAccountMutation,
  useUpdateAvatarMutation,
  useChangePasswordMutation,
  useOnboardUserMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation
} = authApi;
