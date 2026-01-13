export type ID = string;

export type User = {
  _id: string;
  firebaseUid: string;
  username: string;
  email: string;

  avatar?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: string;

  createdAt: string;
  updatedAt: string;
};

export type Brand = {
  _id: ID;
  name: string;
  slug: string;
  logo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  _id: ID;
  brand_id: ID;
  name: string;
  description: string;
  base_price: number;
  discount: number;
  views: number;
  sold: number;
  favorites: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export type Variant = {
  _id: ID;
  product_id: ID;
  color: string;
  size: number;
  stock: number;
  price: number;
  updatedAt: string;
};

export type OrderItem = {
  product_id: ID;
  variant_id: ID;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export type Order = {
  _id: ID;
  user_id: ID;
  items: OrderItem[];
  payment_method: "cod" | "card" | "momo" | "zalopay";
  total_amount: number;
  status: "pending" | "paid" | "shipping" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  shipping_address?: {
    name?: string;
    phone?: string;
    address?: string;
  };
};

export type AdminState = {
  users: User[];
  brands: Brand[];
  products: Product[];
  variants: Variant[];
  orders: Order[];
  vouchers: Voucher[];
};

export type VoucherType = "percent" | "fixed";
export type VoucherStatus = "active" | "expired";

export type Voucher = {
  _id: ID;
  code: string;
  type: VoucherType;
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  used?: number;
  startAt: string; // ISO
  endAt: string; // ISO
  status: VoucherStatus;
  createdAt: string;
  updatedAt: string;
};
export type AdminOneRes<T> = {
  success: boolean;
  data?: T;
  message?: string;
  field?: "name" | "slug" | "logo" | "description";
};
