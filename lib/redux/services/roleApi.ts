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

export interface RoleModulePermission {
  id: string; // moduleId/slug
  moduleName: string;
  category: string;
  access: boolean;
  permissions: {
    view: boolean;
    edit: boolean;
    delete: boolean;
    create: boolean;
  };
}

export interface UserRole {
  roleName: string;
  permissions: RoleModulePermission[];
  id?: string;
  description?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<{ roles: Role[], pagination: any }, { page?: number; limit?: number; search?: string } | void>({
      query: (params) => ({
        url: "/roles",
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<{ roles: Role[], pagination: any }>) => response.data,
      providesTags: (result) =>
        result?.roles
          ? [
              ...result.roles.map(({ _id }) => ({ type: "Role" as const, id: _id })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),
    createRole: builder.mutation<Role, Partial<Role>>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
    updateRole: builder.mutation<Role, { roleId: string; data: Partial<Role> }>({
      query: ({ roleId, data }) => ({
        url: `/roles/${roleId}`,
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
        url: `/roles/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
    getRolePrivileges: builder.query<UserRole, string>({
      query: (roleId) => `/roles/${roleId}/privileges`,
      transformResponse: (response: ApiResponse<UserRole>) => response.data,
      providesTags: (result, error, roleId) => [{ type: "Role", id: roleId }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePrivilegesQuery,
} = roleApi;
