import { baseApi } from "../baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<any, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    syncCart: builder.mutation<any, { items: any[] }>({
      query: (body) => ({
        url: "/cart/sync",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    addToCart: builder.mutation<any, { 
      product: string; 
      itemType?: "Product" | "GiftBox"; 
      quantity?: number; 
      meta?: any;
      sku?: string;
      variant?: string;
    }>({
      query: (body) => ({
        url: "/cart/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<any, { productId: string; quantity?: number; meta?: any }>({
      query: ({ productId, ...body }) => ({
        url: `/cart/update/${productId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<any, string>({
      query: (productId) => ({
        url: `/cart/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<any, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useSyncCartMutation,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
