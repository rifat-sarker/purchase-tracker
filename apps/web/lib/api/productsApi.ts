import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

// Local-storage uploads come back as relative "/uploads/..." paths (see the
// backend's LocalStorageAdapter); Cloudinary URLs are already absolute.
// Seed data also ships absolute unsplash URLs. This makes any of the three
// renderable from a plain <img src>.
export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith('/') ? `${API_ORIGIN}${url}` : url;
}

export type Category =
  | 'PHONE' | 'LAPTOP' | 'DESKTOP' | 'MONITOR' | 'HUB' | 'CABLE'
  | 'PENDRIVE' | 'KEYBOARD' | 'MOUSE' | 'HEADPHONE' | 'CHARGER' | 'OTHER';

export type Status = 'ACTIVE' | 'SOLD' | 'GIFTED' | 'BROKEN' | 'LOST';

// Matches the backend's ProductPublicDTO/ProductOwnerDTO union (product.dto.ts)
// flattened into one type — the owner-only fields are simply absent on the
// wire for an unauthenticated request instead of being typed as a variant.
export interface ProductDTO {
  id: string;
  name: string;
  category: Category;
  brand: string | null;
  model: string | null;
  specs: Record<string, string>;
  referenceImage: string | null;
  tags: string[];
  status: Status;
  ownedSinceYear: number;
  // owner-only
  price?: number;
  currency?: string;
  purchaseDate?: string;
  purchasedFrom?: string | null;
  warrantyExpiry?: string | null;
  serialNumber?: string | null;
  receiptImages?: string[];
  notes?: string | null;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface Envelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface GetProductsParams {
  search?: string;
  category?: string;
  status?: string;
  tags?: string;
  sortBy?: 'purchaseDate' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AnalyticsSummary {
  totalSpend: number;
  totalItems: number;
  averagePrice: number;
}

export interface AnalyticsByCategory {
  category: Category;
  totalSpend: number;
  count: number;
}

export interface AnalyticsByMonth {
  month: string; // "YYYY-MM"
  totalSpend: number;
  count: number;
}

export interface UpcomingWarrantyItem {
  id: string;
  name: string;
  category: Category;
  warrantyExpiry: string;
  warrantyNotified: boolean;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    // Needed so the httpOnly refresh-token cookie set by /auth/login travels
    // with /auth/refresh and /auth/logout requests.
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Product', 'Analytics'],
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (res: Envelope<{ accessToken: string }>) => res.data,
    }),
    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({ url: '/auth/refresh', method: 'POST' }),
      transformResponse: (res: Envelope<{ accessToken: string }>) => res.data,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),

    getProducts: builder.query<Paginated<ProductDTO>, GetProductsParams | void>({
      query: (params) => ({ url: '/products', params: params || undefined }),
      transformResponse: (res: Envelope<ProductDTO[]>) => ({ data: res.data, meta: res.meta! }),
      providesTags: (result) =>
        result
          ? [...result.data.map((p) => ({ type: 'Product' as const, id: p.id })), { type: 'Product' as const, id: 'LIST' }]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),
    getProduct: builder.query<ProductDTO, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (res: Envelope<ProductDTO>) => res.data,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<ProductDTO, FormData>({
      query: (formData) => ({ url: '/products', method: 'POST', body: formData }),
      transformResponse: (res: Envelope<ProductDTO>) => res.data,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, 'Analytics'],
    }),
    updateProduct: builder.mutation<ProductDTO, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({ url: `/products/${id}`, method: 'PATCH', body: formData }),
      transformResponse: (res: Envelope<ProductDTO>) => res.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }, 'Analytics'],
    }),
    deleteProduct: builder.mutation<void, { id: string; hard?: boolean }>({
      query: ({ id, hard }) => ({ url: `/products/${id}${hard ? '?hard=true' : ''}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }, 'Analytics'],
    }),

    getAnalyticsSummary: builder.query<AnalyticsSummary, void>({
      query: () => '/analytics/summary',
      transformResponse: (res: Envelope<AnalyticsSummary>) => res.data,
      providesTags: ['Analytics'],
    }),
    getAnalyticsByCategory: builder.query<AnalyticsByCategory[], void>({
      query: () => '/analytics/by-category',
      transformResponse: (res: Envelope<AnalyticsByCategory[]>) => res.data,
      providesTags: ['Analytics'],
    }),
    getAnalyticsByMonth: builder.query<AnalyticsByMonth[], void>({
      query: () => '/analytics/by-month',
      transformResponse: (res: Envelope<AnalyticsByMonth[]>) => res.data,
      providesTags: ['Analytics'],
    }),
    getUpcomingWarranty: builder.query<UpcomingWarrantyItem[], void>({
      query: () => '/analytics/upcoming-warranty',
      transformResponse: (res: Envelope<UpcomingWarrantyItem[]>) => res.data,
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAnalyticsSummaryQuery,
  useGetAnalyticsByCategoryQuery,
  useGetAnalyticsByMonthQuery,
  useGetUpcomingWarrantyQuery,
} = productsApi;

/**
 * Streams GET /products/export/csv to a file download. Not an RTK Query
 * endpoint because it needs blob handling + a Bearer header outside the
 * normal JSON envelope, and a plain <a href> can't attach an Authorization
 * header for a protected route.
 */
export async function downloadProductsCsv(accessToken: string | null): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/products/export/csv`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    credentials: 'include',
  });
  if (!res.ok) throw new Error('CSV export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gadget-purchases.csv';
  a.click();
  URL.revokeObjectURL(url);
}
