export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  shortDescription: string;
  size: string;
  potIncluded: boolean;
  images: string[];
  specifications: {
    plantType: string;
    height: string;
    potSize: string;
    wateringFrequency: string;
    sunlightRequirement: string;
    location: 'Indoor' | 'Outdoor' | 'Both';
    maintenanceLevel: 'Low' | 'Medium' | 'High';
    petFriendly: boolean;
  };
  careGuide: {
    watering: string;
    sunlight: string;
    maintenance: string;
  };
  inStock: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  deliveryAddress: {
    name: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryOption: string;
  estimatedDelivery: string;
  paymentMethod: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Indoor Plants',
    image: '',
    productCount: 45,
    description: 'Perfect plants for your home and office spaces'
  },
  {
    id: '2',
    name: 'Outdoor Plants',
    image: '',
    productCount: 38,
    description: 'Beautiful plants for gardens and balconies'
  },
  {
    id: '3',
    name: 'Small Plants',
    image: '',
    productCount: 52,
    description: 'Compact plants ideal for desks and shelves'
  },
  {
    id: '4',
    name: 'Large Plants',
    image: '',
    productCount: 28,
    description: 'Statement plants for spacious areas'
  },
  {
    id: '5',
    name: 'Flowering Plants',
    image: '',
    productCount: 42,
    description: 'Colorful blooms to brighten your space'
  },
  {
    id: '6',
    name: 'Air Purifying Plants',
    image: '',
    productCount: 35,
    description: 'Natural air purifiers for healthier living'
  },
  {
    id: '7',
    name: 'Decorative Plants',
    image: '',
    productCount: 40,
    description: 'Aesthetic plants for interior decoration'
  },
  {
    id: '8',
    name: 'Bonsai',
    image: '',
    productCount: 18,
    description: 'Miniature trees for zen spaces'
  },
  {
    id: '9',
    name: 'Gardening Essentials',
    image: '',
    productCount: 67,
    description: 'Pots, tools, and accessories'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    category: 'Indoor Plants',
    price: 799,
    originalPrice: 1299,
    discount: 38,
    image: '',
    description: 'The Monstera Deliciosa, also known as the Swiss Cheese Plant, is a stunning tropical plant that brings a touch of the jungle to your home. With its iconic split leaves and easy-care nature, it\'s perfect for both beginners and experienced plant parents.',
    shortDescription: 'Iconic split-leaf tropical beauty',
    size: 'Medium (12-18 inches)',
    potIncluded: true,
    images: ['', '', ''],
    specifications: {
      plantType: 'Tropical',
      height: '12-18 inches',
      potSize: '6 inches',
      wateringFrequency: 'Once a week',
      sunlightRequirement: 'Bright indirect light',
      location: 'Indoor',
      maintenanceLevel: 'Low',
      petFriendly: false
    },
    careGuide: {
      watering: 'Water when the top 2 inches of soil are dry. Avoid overwatering.',
      sunlight: 'Thrives in bright, indirect light. Avoid direct sunlight which can burn the leaves.',
      maintenance: 'Wipe leaves monthly to remove dust. Feed with liquid fertilizer every 4-6 weeks during growing season.'
    },
    inStock: true,
    featured: true,
    bestSeller: true
  },
  {
    id: '2',
    name: 'Snake Plant',
    category: 'Air Purifying Plants',
    price: 399,
    originalPrice: 599,
    discount: 33,
    image: '',
    description: 'The Snake Plant is one of the most resilient houseplants. It purifies air by removing toxins and requires minimal care, making it perfect for beginners.',
    shortDescription: 'Low-maintenance air purifier',
    size: 'Small (8-12 inches)',
    potIncluded: true,
    images: ['', ''],
    specifications: {
      plantType: 'Succulent',
      height: '8-12 inches',
      potSize: '4 inches',
      wateringFrequency: 'Every 2-3 weeks',
      sunlightRequirement: 'Low to bright indirect light',
      location: 'Indoor',
      maintenanceLevel: 'Low',
      petFriendly: false
    },
    careGuide: {
      watering: 'Water sparingly. Allow soil to dry completely between waterings.',
      sunlight: 'Tolerates low light but grows faster in bright indirect light.',
      maintenance: 'Very low maintenance. Wipe leaves occasionally to keep them dust-free.'
    },
    inStock: true,
    bestSeller: true
  },
  {
    id: '3',
    name: 'Peace Lily',
    category: 'Flowering Plants',
    price: 599,
    originalPrice: 899,
    discount: 33,
    image: '',
    description: 'Elegant Peace Lily with beautiful white blooms. Excellent air purifier that thrives in low light conditions.',
    shortDescription: 'Elegant white blooms, air purifying',
    size: 'Medium (10-15 inches)',
    potIncluded: true,
    images: ['', ''],
    specifications: {
      plantType: 'Flowering',
      height: '10-15 inches',
      potSize: '5 inches',
      wateringFrequency: 'Twice a week',
      sunlightRequirement: 'Low to medium indirect light',
      location: 'Indoor',
      maintenanceLevel: 'Low',
      petFriendly: false
    },
    careGuide: {
      watering: 'Keep soil consistently moist but not waterlogged. Wilts when thirsty.',
      sunlight: 'Prefers low to medium indirect light. Can tolerate shade.',
      maintenance: 'Remove dead flowers and leaves. Mist occasionally for humidity.'
    },
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Jade Plant',
    category: 'Small Plants',
    price: 299,
    originalPrice: 499,
    discount: 40,
    image: '',
    description: 'Lucky Jade Plant, symbol of prosperity and good fortune. A compact succulent perfect for desks and small spaces.',
    shortDescription: 'Lucky plant, easy to care',
    size: 'Small (6-8 inches)',
    potIncluded: true,
    images: [''],
    specifications: {
      plantType: 'Succulent',
      height: '6-8 inches',
      potSize: '3 inches',
      wateringFrequency: 'Every 2-3 weeks',
      sunlightRequirement: 'Bright indirect light',
      location: 'Both',
      maintenanceLevel: 'Low',
      petFriendly: false
    },
    careGuide: {
      watering: 'Water sparingly. Let soil dry completely between waterings.',
      sunlight: 'Needs bright light with some direct morning sun.',
      maintenance: 'Minimal care needed. Prune to maintain shape.'
    },
    inStock: true,
    newArrival: true
  },
  {
    id: '5',
    name: 'Fiddle Leaf Fig',
    category: 'Large Plants',
    price: 1499,
    originalPrice: 2299,
    discount: 35,
    image: '',
    description: 'Statement Fiddle Leaf Fig with large, violin-shaped leaves. A popular choice for modern interiors.',
    shortDescription: 'Large statement plant for modern homes',
    size: 'Large (24-36 inches)',
    potIncluded: true,
    images: ['', ''],
    specifications: {
      plantType: 'Tree',
      height: '24-36 inches',
      potSize: '10 inches',
      wateringFrequency: 'Once a week',
      sunlightRequirement: 'Bright indirect light',
      location: 'Indoor',
      maintenanceLevel: 'Medium',
      petFriendly: false
    },
    careGuide: {
      watering: 'Water thoroughly when top inch of soil is dry.',
      sunlight: 'Needs bright, filtered light. Rotate regularly for even growth.',
      maintenance: 'Wipe leaves weekly. Avoid moving frequently as it dislikes change.'
    },
    inStock: true,
    featured: true
  },
  {
    id: '6',
    name: 'Areca Palm',
    category: 'Large Plants',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    image: '',
    description: 'Graceful Areca Palm adds a tropical touch to any space. Excellent air purifier and humidity booster.',
    shortDescription: 'Tropical palm, excellent air purifier',
    size: 'Large (30-40 inches)',
    potIncluded: true,
    images: ['', ''],
    specifications: {
      plantType: 'Palm',
      height: '30-40 inches',
      potSize: '10 inches',
      wateringFrequency: '2-3 times a week',
      sunlightRequirement: 'Bright indirect light',
      location: 'Indoor',
      maintenanceLevel: 'Medium',
      petFriendly: true
    },
    careGuide: {
      watering: 'Keep soil moist but not soggy. Mist regularly for humidity.',
      sunlight: 'Prefers bright, indirect light. Can tolerate some shade.',
      maintenance: 'Remove brown fronds. Feed monthly during growing season.'
    },
    inStock: true,
    bestSeller: true
  },
  {
    id: '7',
    name: 'Ficus Bonsai',
    category: 'Bonsai',
    price: 1899,
    originalPrice: 2799,
    discount: 32,
    image: '',
    description: 'Stunning Ficus Bonsai tree, carefully trained for years. A living art piece for your home or office.',
    shortDescription: 'Artistic miniature tree',
    size: 'Small (8-12 inches)',
    potIncluded: true,
    images: ['', ''],
    specifications: {
      plantType: 'Bonsai',
      height: '8-12 inches',
      potSize: '6 inches ceramic',
      wateringFrequency: 'Daily',
      sunlightRequirement: 'Bright indirect light',
      location: 'Indoor',
      maintenanceLevel: 'High',
      petFriendly: false
    },
    careGuide: {
      watering: 'Water daily. Soil should remain slightly moist.',
      sunlight: 'Needs bright, indirect light near a window.',
      maintenance: 'Prune regularly. Wire branches carefully. Requires dedicated care.'
    },
    inStock: true,
    featured: true
  },
  {
    id: '8',
    name: 'Aloe Vera',
    category: 'Small Plants',
    price: 249,
    originalPrice: 399,
    discount: 38,
    image: '',
    description: 'Medicinal Aloe Vera plant with numerous health benefits. Easy to care succulent perfect for sunny spots.',
    shortDescription: 'Medicinal succulent with healing gel',
    size: 'Small (6-10 inches)',
    potIncluded: true,
    images: [''],
    specifications: {
      plantType: 'Succulent',
      height: '6-10 inches',
      potSize: '4 inches',
      wateringFrequency: 'Every 2-3 weeks',
      sunlightRequirement: 'Bright direct light',
      location: 'Both',
      maintenanceLevel: 'Low',
      petFriendly: false
    },
    careGuide: {
      watering: 'Water deeply but infrequently. Let soil dry completely.',
      sunlight: 'Loves bright, direct sunlight. Can tolerate partial shade.',
      maintenance: 'Very low maintenance. Remove dead leaves from base.'
    },
    inStock: true,
    newArrival: true
  },
  {
    id: '9',
    name: 'Rose Plant',
    category: 'Outdoor Plants',
    price: 499,
    originalPrice: 799,
    discount: 38,
    image: '',
    description: 'Beautiful flowering Rose plant with fragrant blooms. Perfect for gardens and large balconies.',
    shortDescription: 'Classic flowering beauty',
    size: 'Medium (12-18 inches)',
    potIncluded: true,
    images: ['', ''],
    specifications: {
      plantType: 'Flowering Shrub',
      height: '12-18 inches',
      potSize: '8 inches',
      wateringFrequency: 'Daily',
      sunlightRequirement: 'Full sun (6+ hours)',
      location: 'Outdoor',
      maintenanceLevel: 'High',
      petFriendly: true
    },
    careGuide: {
      watering: 'Water daily in morning. Needs consistent moisture.',
      sunlight: 'Requires 6+ hours of direct sunlight daily.',
      maintenance: 'Prune regularly. Deadhead spent blooms. Feed every 2 weeks.'
    },
    inStock: true,
    bestSeller: true
  },
  {
    id: '10',
    name: 'Spider Plant',
    category: 'Air Purifying Plants',
    price: 299,
    originalPrice: 499,
    discount: 40,
    image: '',
    description: 'Easy-care Spider Plant with cascading foliage. Excellent air purifier and produces baby plants.',
    shortDescription: 'Cascading air purifier',
    size: 'Small (8-12 inches)',
    potIncluded: true,
    images: [''],
    specifications: {
      plantType: 'Perennial',
      height: '8-12 inches',
      potSize: '5 inches',
      wateringFrequency: 'Twice a week',
      sunlightRequirement: 'Bright indirect light',
      location: 'Indoor',
      maintenanceLevel: 'Low',
      petFriendly: true
    },
    careGuide: {
      watering: 'Water when top inch of soil is dry. Tolerates some neglect.',
      sunlight: 'Prefers bright, indirect light but adapts to various conditions.',
      maintenance: 'Very easy. Trim brown tips. Propagate baby plants easily.'
    },
    inStock: true,
    newArrival: true
  },
  {
    id: '11',
    name: 'Money Plant',
    category: 'Indoor Plants',
    price: 199,
    originalPrice: 349,
    discount: 43,
    image: '',
    description: 'Popular Money Plant believed to bring prosperity and good luck. Easy to grow in water or soil.',
    shortDescription: 'Auspicious, easy to grow',
    size: 'Small (trailing vine)',
    potIncluded: true,
    images: [''],
    specifications: {
      plantType: 'Climber',
      height: 'Trailing',
      potSize: '4 inches',
      wateringFrequency: 'Twice a week',
      sunlightRequirement: 'Low to bright indirect light',
      location: 'Indoor',
      maintenanceLevel: 'Low',
      petFriendly: false
    },
    careGuide: {
      watering: 'Keep soil moderately moist. Can also grow in water.',
      sunlight: 'Adapts to various light conditions. Grows faster in bright light.',
      maintenance: 'Extremely easy. Prune to control length. Propagates easily.'
    },
    inStock: true,
    bestSeller: true
  },
  {
    id: '12',
    name: 'Rubber Plant',
    category: 'Indoor Plants',
    price: 699,
    originalPrice: 1099,
    discount: 36,
    image: '',
    description: 'Bold Rubber Plant with glossy, burgundy leaves. Makes a striking statement in modern interiors.',
    shortDescription: 'Bold burgundy foliage',
    size: 'Medium (18-24 inches)',
    potIncluded: true,
    images: ['', ''],
    specifications: {
      plantType: 'Tree',
      height: '18-24 inches',
      potSize: '8 inches',
      wateringFrequency: 'Once a week',
      sunlightRequirement: 'Bright indirect light',
      location: 'Indoor',
      maintenanceLevel: 'Low',
      petFriendly: false
    },
    careGuide: {
      watering: 'Water when top 2 inches of soil are dry.',
      sunlight: 'Prefers bright, indirect light. Can tolerate some shade.',
      maintenance: 'Wipe leaves regularly to maintain shine. Prune to control height.'
    },
    inStock: true,
    featured: true
  }
];

// This will be populated with Unsplash images
export let productImages: Record<string, string[]> = {};

export function setProductImages(images: Record<string, string[]>) {
  productImages = images;
}
