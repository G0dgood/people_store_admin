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
    getCurrentUser: builder.query({
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
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useGetCurrentUserQuery,
  useUpdateAccountMutation,
  useUpdateAvatarMutation,
  useChangePasswordMutation
} = authApi;
