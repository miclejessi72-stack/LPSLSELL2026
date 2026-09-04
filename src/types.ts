export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: UserRole;
  vatId?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  registeredEngines?: UserPlantEngine[];
}

export interface UserPlantEngine {
  id: string;
  plantName: string;
  brand: string;
  model: string;
  serialNumber: string;
  operatingHours: number;
  commissionYear: number;
}

export interface TieredPrice {
  minQty: number;
  price: number;
}

export interface Product {
  id: string;
  partNumber: string;
  oemNumber: string;
  name: string;
  brand: string; // e.g., Denso, Champion, Motortech, Mann, Federal-Mogul, Bosch, Mahle, Limburg Power
  category: string; // e.g., 'Ignition', 'Filters', 'Gaskets', 'Engine Mechanics', 'Sensors', 'Lubricants'
  subCategory: string;
  price: number; // EUR base price
  inStock: boolean;
  stockCount: number;
  description: string;
  specifications: Record<string, string>;
  engineCompatibility: string[]; // e.g. ["Jenbacher J320", "MAN E2876", "MWM TCG 2020"]
  badge?: 'OEM Genuine' | 'Premium Alternative' | 'Fast Mover' | 'Special Offer';
  imageUrl: string;
  minOrderQty: number;
  tieredPricing?: TieredPrice[];
  weightKg?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  itemCount: number;
  description: string;
}

export interface EngineBrand {
  id: string;
  name: string;
  series: string[];
  models: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  company: string;
  vatId?: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  createdAt: string;
  notes?: string;
}

export interface QuoteRequest {
  id: string;
  quoteNumber: string;
  customerName: string;
  email: string;
  company: string;
  phone: string;
  engineBrand?: string;
  engineModel?: string;
  engineSerial?: string;
  urgency: 'Standard (24h)' | 'Urgent Breakdown (Same Day)' | 'Planned Overhaul';
  items: {
    productName: string;
    partNumber?: string;
    quantity: number;
    notes?: string;
  }[];
  customerNotes?: string;
  status: 'Pending' | 'Reviewing' | 'Quoted' | 'Approved' | 'Declined';
  quotedPrice?: number;
  adminNotes?: string;
  createdAt: string;
}

export interface FilterState {
  category: string;
  engineBrand: string;
  engineModel: string;
  searchQuery: string;
  inStockOnly: boolean;
  brand: string;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'name' | 'stock';
}
