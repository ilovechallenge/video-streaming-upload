import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseURL = "http://video-streaming-api.mastercode.jp:8000/";
// export const baseURL = "http://127.0.0.1:8000/";

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: ["Videos"],
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => `/videos/`,
      providesTags: ["Videos"],
    }),
    getVideoById: builder.query({
      query: (videoId) => `/videos/get_video_by_id?video_id=${videoId}`,
      invalidatesTags: ["Videos"],
    }),
    updateVideos: builder.mutation({
      query: ({ id, data }) => ({
        url: `videos/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Videos"],
    }),
    deleteVideos: builder.mutation({
      query: (ids) => ({
        url: `videos/delete_videos/`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: { ids },
      }),
    }),
  }),
});

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => `/categories/`,
    }),
  }),
});

export const gradeApi = createApi({
  reducerPath: "gradeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: ["Grades"],
  endpoints: (builder) => ({
    getGrades: builder.query({
      query: (id) => `/grades/?category_id=${id}`,
    }),
  }),
});

export const unitApi = createApi({
  reducerPath: "unitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: ["Units"],
  endpoints: (builder) => ({
    getUnits: builder.query({
      query: (id) => `/units/?grade_id=${id}`,
    }),
    updateUnits: builder.mutation({
      query: (ids) => ({
        url: `/units/update_units/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { ids },
      }),
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoByIdQuery,
  useUpdateVideosMutation,
  useDeleteVideosMutation,
} = videoApi;
export const { useGetCategoriesQuery } = categoryApi;
export const { useGetGradesQuery } = gradeApi;
export const { useGetUnitsQuery, useUpdateUnitsMutation } = unitApi;
