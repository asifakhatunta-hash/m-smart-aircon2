export interface Product {
  id: string;
  title: string;
  sellingPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  stock: number;
  warranty: string;
  description: string;
  images: string[];
  highlights: string[];
  specifications: { key: string; value: string }[];
  categoryId: string;
  categoryName?: string;
  featured: boolean;
  codAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  active: boolean;
  order: number;
  type: "hero" | "offer" | "deal";
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "online";
  address: string;
  city: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Customer {
  uid: string;
  name: string;
  mobile: string;
  email: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}
