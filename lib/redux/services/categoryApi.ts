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
  hasScentFamily?: boolean;
  selectedScentFamilies?: string[];
  hasGender?: boolean;
  selectedGenders?: string[];
  hasCollection?: boolean;
  selectedCollections?: string[];
  hasGifting?: boolean;
  selectedGiftings?: string[];
  customAttributes?: { name: string; subAttributes: string[] }[];
  owner?: string;
  parent?: string | CategoryItem | null;
  subCategories?: string[] | CategoryItem[];
  createdAt: string;
  updatedAt: string;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiResponse<{ categories: CategoryItem[], pagination: any }>, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: '/categories',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.categories
          ? [
              ...result.data.categories.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
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
    getCategoryCustomAttributes: builder.query<ApiResponse<{ name: string; subAttributes: string[] }[]>, string>({
      query: (categoryIdOrName) => `/categories/${categoryIdOrName}/custom-attributes`,
      providesTags: (result, error, categoryIdOrName) => [{ type: 'Category' as const, id: `ATTRIBUTES_${categoryIdOrName}` }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryCustomAttributesQuery,
} = categoryApi;
