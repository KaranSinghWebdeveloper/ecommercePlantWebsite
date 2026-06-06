export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  inStock: boolean;
  size: string;
  potIncluded: boolean;
  plantType: string;
  height: string;
  potSize: string;
  wateringFrequency: string;
  sunlightRequirement: string;
  location: string;
  maintenanceLevel: string;
  petFriendly: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviews: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  customerInfo: CustomerInfo;
}

export interface CustomerInfo {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}
