import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface CategoryItem {
  _id: string;
  name: string;
  image: string;
  description?: string;
  hasSize: boolean;
  hasML: boolean;
  hasSex: boolean;
  selectedSizes: string[];
  selectedMLs: string[];
  selectedSexes: string[];
  owner?: string;
  parent?: string | CategoryItem | null;
  subCategories?: string[] | CategoryItem[];
  createdAt: string;
  updatedAt: string;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiResponse<CategoryItem[]>, { search?: string; status?: string } | void>({
      query: (params) => ({
        url: '/categories',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
    createCategory: builder.mutation<ApiResponse<CategoryItem>, Partial<CategoryItem>>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation<ApiResponse<CategoryItem>, { categoryId: string; body: Partial<CategoryItem> }>({
      query: ({ categoryId, body }) => ({
        url: `/categories/${categoryId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { categoryId }) => [{ type: 'Category' as const, id: categoryId }],
    }),
    deleteCategory: builder.mutation<ApiResponse<{}>, string>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
