import { baseApi } from '../baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/users/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (userData) => {
        const formData = new FormData();
        formData.append('fullName', userData.fullName);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        if (userData.avatar) {
          formData.append('avatar', userData.avatar);
        }
        return {
          url: '/users/register',
          method: 'POST',
          body: formData,
        };
      },
    }),
    socialLogin: builder.mutation({
      query: (data) => ({
        url: '/users/social-login',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
    }),
    getUsers: builder.query<{ users: any[], pagination: any }, { page?: number, limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/users?page=${page}&limit=${limit}`,
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
        url: '/users/current-user',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.query<any, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
      transformResponse: (response: any) => response.data,
    }),
    updateAccount: builder.mutation({
      query: (details) => ({
        url: '/users/update-account',
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
          url: '/users/avatar',
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: '/users/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),
    onboardUser: builder.mutation({
      query: (userData) => ({
        url: '/users/onboard',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateStaff: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
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
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    lockStaffSession: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/lock-session`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' }
      ],
    }),
    resetStaffPassword: builder.mutation({
      query: ({ userId, newPassword }) => ({
        url: `/users/${userId}/reset-password`,
        method: 'PATCH',
        body: { newPassword }
      }),
    }),
    bulkDeleteStaff: builder.mutation({
      query: (userIds) => ({
        url: '/users/bulk-delete',
        method: 'POST',
        body: { userIds }
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    bulkLockStaff: builder.mutation({
      query: ({ userIds, status }) => ({
        url: '/users/bulk-lock',
        method: 'PATCH',
        body: { userIds, status }
      }),
      invalidatesTags: (result, error, { userIds }) => [
        ...userIds.map((id: string) => ({ type: 'User' as const, id })),
        { type: 'User', id: 'LIST' }
      ],
    }),
  }),
  overrideExisting: true,
});

export const { 
  useLoginMutation, 
  useRegisterMutation,
  useSocialLoginMutation,
  useLogoutMutation, 
  useGetUsersQuery,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useUpdateAccountMutation,
  useUpdateAvatarMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useOnboardUserMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useLockStaffSessionMutation,
  useResetStaffPasswordMutation,
  useBulkDeleteStaffMutation,
  useBulkLockStaffMutation
} = authApi;
