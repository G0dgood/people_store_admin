import { baseApi } from "../baseApi";

export interface Module {
  _id: string;
  slug: string;
  label: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export const moduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModules: builder.query<Module[], void>({
      query: () => "/modules",
      transformResponse: (response: ApiResponse<Module[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Module" as const, id: _id })),
              { type: "Module", id: "LIST" },
            ]
          : [{ type: "Module", id: "LIST" }],
    }),
    createModule: builder.mutation<Module, Partial<Module>>({
      query: (body) => ({
        url: "/modules",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Module", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetModulesQuery,
  useCreateModuleMutation,
} = moduleApi;
