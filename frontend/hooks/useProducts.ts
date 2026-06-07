import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';

export function useProducts(filters?: { category?: string }) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => productsApi.getAll(filters),
    });
}

export function useProduct(slug: string) {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: () => productsApi.getBySlug(slug),
        enabled: !!slug,
    });
}