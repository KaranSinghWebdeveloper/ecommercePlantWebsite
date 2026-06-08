import { useQuery } from '@tanstack/react-query';
import { productsApi, ApiProduct, ProductFilters } from '@/lib/api/products';

export function useProducts(filters?: ProductFilters) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: async () => {
            const res = await productsApi.getAll(filters);
            // Unwrap the { success, data, meta } envelope
            return res.data as ApiProduct[];
        },
    });
}

export function useProduct(slug: string) {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const res = await productsApi.getBySlug(slug);
            return res.data as ApiProduct;
        },
        enabled: !!slug,
    });
}