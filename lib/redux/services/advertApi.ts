import { baseApi } from "../baseApi";
import { ApiResponse } from "@/lib/types/api";

export interface AdvertItem {
  id: any;
  _id: string;
  name: string;
  category: any;
  price: number | string;
  productImage: string;
  image?: string; // Fallback for legacy/static data
}

export interface BackgroundAsset {
  url: string;
  positionX: number;
  positionY: number;
  linkedCategory?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  stats?: string;
  duration?: number;
  featuredItems?: AdvertItem[];
  inventoryLayout?: "list" | "grid" | "strip";
}

export interface AdvertConfig {
  _id?: string;
  backgroundImages: BackgroundAsset[];
  featuredItems: AdvertItem[];
  layout: "left-form" | "right-form" | "";
  inventoryLayout: "list" | "grid" | "strip" | "";
  showTitle: boolean;
  showHighlight: boolean;
  showDescription: boolean;
  showStats: boolean;
  title: string;
  titleHighlight: string;
  description: string;
  stats: string;
  cycleDuration: number;
}

export const advertApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdvertConfig: builder.query<AdvertConfig, void>({
      query: () => "/adverts/config",
      transformResponse: (response: ApiResponse<AdvertConfig>) => response.data,
      providesTags: ["Advert"],
    }),
    getAdverts: builder.query<{ adverts: AdvertConfig[], pagination: any }, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/adverts",
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<{ adverts: AdvertConfig[], pagination: any }>) => response.data,
      providesTags: (result) =>
        result?.adverts
          ? [
              ...result.adverts.map(({ _id }) => ({ type: "Advert" as const, id: _id })),
              { type: "Advert", id: "LIST" },
            ]
          : [{ type: "Advert", id: "LIST" }],
    }),
    getAdvertById: builder.query<AdvertConfig, string>({
      query: (id) => `/adverts/${id}`,
      transformResponse: (response: ApiResponse<AdvertConfig>) => response.data,
      providesTags: (result, error, id) => [{ type: "Advert", id }],
    }),
    createAdvertConfig: builder.mutation<AdvertConfig, Partial<AdvertConfig>>({
      query: (body) => ({
        url: "/adverts",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<AdvertConfig>) => response.data,
      invalidatesTags: ["Advert", { type: "Advert", id: "LIST" }],
    }),
    updateAdvertConfig: builder.mutation<AdvertConfig, { id: string; data: Partial<AdvertConfig> }>({
      query: ({ id, data }) => ({
        url: `/adverts/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ApiResponse<AdvertConfig>) => response.data,
      invalidatesTags: (result, error, { id }) => ["Advert", { type: "Advert", id }, { type: "Advert", id: "LIST" }],
    }),
    deleteAdvert: builder.mutation<void, string>({
      query: (id) => ({
        url: `/adverts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Advert", { type: "Advert", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdvertConfigQuery,
  useGetAdvertsQuery,
  useGetAdvertByIdQuery,
  useCreateAdvertConfigMutation,
  useUpdateAdvertConfigMutation,
  useDeleteAdvertMutation,
} = advertApi;
