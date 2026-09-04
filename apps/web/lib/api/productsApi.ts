import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Analytics'],
  endpoints: (builder) => ({
    getProducts: builder.query<any, Record<string, string | number> | void>({
      query: (params) => ({
        url: '/products',
        params: params || undefined,
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query<any, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Product', 'Analytics'],
    }),
    updateProduct: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product',
        'Analytics',
      ],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'Analytics'],
    }),
    getAnalyticsSummary: builder.query<any, void>({
      query: () => '/analytics/summary',
      providesTags: ['Analytics'],
    }),
    getAnalyticsByCategory: builder.query<any, void>({
      query: () => '/analytics/by-category',
      providesTags: ['Analytics'],
    }),
    getAnalyticsByMonth: builder.query<any, void>({
      query: () => '/analytics/by-month',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAnalyticsSummaryQuery,
  useGetAnalyticsByCategoryQuery,
  useGetAnalyticsByMonthQuery,
} = productsApi;
