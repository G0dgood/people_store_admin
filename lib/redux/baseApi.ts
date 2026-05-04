import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && (result.error as any).status === 401) {
    const isLogout = typeof args === 'string' ? args.includes('/logout') : args.url?.includes('/logout');

    if (typeof window !== 'undefined' && !isLogout) {
      // Avoid firing multiple events in a short window
      const now = Date.now();
      const lastExpired = (window as any)._lastSessionExpired || 0;
      
      if (now - lastExpired > 5000) { // 5 second throttle
        (window as any)._lastSessionExpired = now;
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Product',
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
    'Customers',
    'Ticket',
    'Refund',
    'Transaction',
    'Message',
    'Review',
    'Deal',
    'Cart',
    'Wishlist',
    'RecentlyViewed',
    'GiftBox',
    'GiftCard'
  ],
  endpoints: () => ({}),
});
