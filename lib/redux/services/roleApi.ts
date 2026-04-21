import { baseApi } from "../baseApi";

export interface Role {
  _id: string;
  name: string;
  description: string;
  status: string;
  users: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => "/v1/roles",
      transformResponse: (response: ApiResponse<Role[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Role" as const, id: _id })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),
    createRole: builder.mutation<Role, Partial<Role>>({
      query: (body) => ({
        url: "/v1/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
    updateRole: builder.mutation<Role, { roleId: string; data: Partial<Role> }>({
      query: ({ roleId, data }) => ({
        url: `/v1/roles/${roleId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: "Role", id: roleId },
        { type: "Role", id: "LIST" }
      ],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (roleId) => ({
        url: `/v1/roles/${roleId}`, // No comma here, just string interpolation
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
