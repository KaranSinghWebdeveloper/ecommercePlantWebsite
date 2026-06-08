import { useQuery } from '@tanstack/react-query';
import { categoriesApi, ApiCategory } from '@/lib/api/categories';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await categoriesApi.getAll();
            // Unwrap the { success, data } envelope
            return res.data as ApiCategory[];
        },
    });
}

export function useCategory(slug: string) {
    return useQuery({
        queryKey: ['category', slug],
        queryFn: async () => {
            const res = await categoriesApi.getBySlug(slug);
            return res.data as ApiCategory;
        },
        enabled: !!slug,
    });
}