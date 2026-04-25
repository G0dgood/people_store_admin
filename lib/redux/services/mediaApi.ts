import { Key, ReactNode } from 'react';
import { baseApi } from '../baseApi';
import { ApiResponse } from '@/lib/types/api';

export interface MediaItem {
  id: Key | null | undefined;
  date: ReactNode;
  _id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: string;
  publicId: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMediaItems: builder.query<ApiResponse<MediaItem[]>, void>({
      query: () => '/media',
      providesTags: ['Media'],
    }),
    uploadMedia: builder.mutation<ApiResponse<MediaItem[]>, FormData>({
      query: (formData) => ({
        url: '/media',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Media'],
    }),
    deleteMedia: builder.mutation<ApiResponse<{}>, string>({
      query: (mediaId) => ({
        url: `/media/${mediaId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMediaItemsQuery,
  useUploadMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
