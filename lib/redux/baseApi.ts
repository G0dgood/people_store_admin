import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    prepareHeaders: (headers) => {
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Product',
    'User',
    'Order',
    'Category',
    'Role',
    'Module',
    'Media',
    'FAQ',
    'Coupon',
    'Brand',
    'Notification',
    'Advert',
    'Customers'],
  endpoints: () => ({}),
});
