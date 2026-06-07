import { apiClient } from './client';

export const productsApi = {
    getAll: (params?: { category?: string; featured?: boolean }) =>
        apiClient(`/products?${new URLSearchParams(params as any)}`),

    getBySlug: (slug: string) =>
        apiClient(`/products/${slug}`),

    getFeatured: () =>
        apiClient(`/products?featured=true`),
};