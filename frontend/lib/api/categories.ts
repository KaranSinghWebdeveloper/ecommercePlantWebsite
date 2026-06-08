import { apiClient } from './client';

export interface ApiCategory {
    id: number | string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    imageAlt?: string;
    productCount?: number;
    status: string;
}

export const categoriesApi = {
    getAll: () => apiClient<ApiCategory[]>('/categories'),
    getBySlug: (slug: string) => apiClient<ApiCategory>(`/categories/slug/${slug}`),
};