import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BlogPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  yoast_head_json?: {
    og_image?: Array<{
      url: string;
      width: number;
      height: number;
    }>;
    title?: string;
    description?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://exampleblog.com/wp-json/wp/v2' }),
  endpoints: (builder) => ({
    getPosts: builder.query<BlogPost[], void>({
      query: () => '/posts',
    }),
    getPostBySlug: builder.query<BlogPost[], string>({
      query: (slug) => `/posts?slug=${slug}`,
    }),
  }),
});

export const { useGetPostsQuery, useGetPostBySlugQuery } = blogApi;
