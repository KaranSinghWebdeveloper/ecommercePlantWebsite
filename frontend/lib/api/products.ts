import { apiClient } from './client';

// API-level product type (matches backend response shape)
export interface ApiProduct {
    id: string | number;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    comparePrice?: number;
    discount?: number;
    image?: string;
    images: { id: number; imageUrl: string; imageAlt?: string; isPrimary: boolean; sortOrder: number }[];
    category: { id: string | number; name: string; slug: string };
    stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock';
    stockAvailable: number;
    featured: boolean;
    bestSeller: boolean;
    newArrival: boolean;
    petFriendly: boolean;
    potIncluded: boolean;
    // Plant attributes
    size?: string;
    plantType?: string;
    height?: string;
    potSize?: string;
    wateringFrequency?: string;
    sunlightRequirement?: string;
    location?: string;
    maintenanceLevel?: string;
    ratingAvg: number;
    reviewsCount: number;
}

export interface ProductFilters {
    category?: string;
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating' | 'discount';
    page?: number;
    limit?: number;
}

export const productsApi = {
    getAll: (params?: ProductFilters) => {
        // Safely build query string, omitting undefined values
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.set(key, String(value));
                }
            });
        }
        const query = searchParams.toString();
        return apiClient<ApiProduct[]>(`/products${query ? `?${query}` : ''}`);
    },

    getBySlug: (slug: string) =>
        // Route is GET /api/products/slug/:slug
        apiClient<ApiProduct>(`/products/slug/${slug}`),

    getFeatured: () =>
        apiClient<ApiProduct[]>(`/products?featured=true`),
};