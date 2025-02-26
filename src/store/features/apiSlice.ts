import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["CardItems", "GalleryItems"],
  endpoints: (builder) => ({
    // Fetch Card Items
    getCardItems: builder.query({
      query: () => "/items?type=cards",
      providesTags: ["CardItems"],
    }),

    // Fetch Gallery Items
    getGalleryItems: builder.query({
      query: () => "/items?type=gallery",
      providesTags: ["GalleryItems"],
    }),

    // Add Card Item
    addCardItem: builder.mutation({
      query: (formData) => ({
        url: "/items",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CardItems"],
    }),

    // Update Card Item
    updateCardItem: builder.mutation({
      query: (formData) => ({
        url: `/items`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["CardItems"],
    }),

    // Delete Card Item
    deleteCardItem: builder.mutation({
      query: (items) => ({
        url: "/items",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      }),
      invalidatesTags: ["CardItems"],
    }),
    

    // Add Gallery Item
    addGalleryItem: builder.mutation({
      query: (formData) => ({
        url: "/items",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["GalleryItems"],
    }),

    // Update Gallery Item
    updateGalleryItem: builder.mutation({
      query: (formData) => ({
        url: `/items`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["GalleryItems"],
    }),

    // Delete Gallery Item
    deleteGalleryItem: builder.mutation({
      query: (items) => ({
        url: "/items",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      }),
      invalidatesTags: ["GalleryItems"],
    }),
  }),
});

export const {
  useGetCardItemsQuery,
  useGetGalleryItemsQuery,
  useAddCardItemMutation,
  useUpdateCardItemMutation,
  useDeleteCardItemMutation,
  useAddGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = apiSlice;
