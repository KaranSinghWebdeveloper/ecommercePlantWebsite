import { apiClient } from './client';

export const categoriesApi = {
    getAll: () => apiClient('/categories'),
    getBySlug: (slug: string) => apiClient(`/categories/${slug}`),
};