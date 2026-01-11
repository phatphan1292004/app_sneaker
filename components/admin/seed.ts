import type { AdminState } from "../../types/admin";

const nowISO = () => new Date().toISOString();

export const seedState: AdminState = {
  users: [
    {
      _id: "69330ea3b55dae8b737eb915",
      firebaseUid: "Mvh3EqDSvDYSOkOAfK5pvH0AmUY2",
      username: "hoanganh123",
      email: "hoanganh123@gmail.com",
      createdAt: "2025-12-05T16:56:03.216Z",
      updatedAt: "2025-12-05T16:56:03.216Z",
    },
    {
      _id: "admin",
      firebaseUid: "admin-firebase-uid",
      username: "admin",
      email: "admin@gmail.com",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: nowISO(),
    },
  ],
  brands: [
    {
      _id: "69306552e99716965b55eaf0",
      name: "Nike",
      slug: "nike",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
      description: "Thương hiệu giày thể thao lớn nhất thế giới.",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  ],
  products: [
    {
      _id: "6933100936bfc4db47d9e0d3",
      brand_id: "69306552e99716965b55eaf0",
      name: "Air Jordan 1 Low SE",
      description: "Always in, always fresh. Air Jordan 1 Low...",
      base_price: 3200000,
      discount: 10,
      views: 0,
      sold: 12,
      favorites: 1,
      images: [
        "https://images.unsplash.com/photo-1528701800489-20be3c0ea0bb?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      ],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2025-12-30T13:42:52.950Z",
    },
  ],
  variants: [
    {
      _id: "6933115436bfc4db47d9e0e5",
      product_id: "6933100936bfc4db47d9e0d3",
      color: "White",
      size: 40,
      stock: 18,
      price: 3200000,
      updatedAt: "2025-12-30T13:42:52.759Z",
    },
  ],
  orders: [
    {
      _id: "693d7d4d69ff732cd1438012",
      user_id: "admin",
      items: [
        {
          product_id: "6933100936bfc4db47d9e0d3",
          variant_id: "6933115436bfc4db47d9e0e5",
          name: "Air Jordan 1 Low SE",
          price: 3200000,
          qty: 1,
          image:
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop",
        },
      ],
      shipping_address: {
        name: "Admin",
        phone: "0900000000",
        address: "HCM City",
      },
      payment_method: "cod",
      total_amount: 3200000,
      status: "paid",
      createdAt: "2025-12-13T14:50:53.703Z",
      updatedAt: "2025-12-13T14:50:53.703Z",
    },
  ],

  vouchers: [
    {
      _id: "v1",
      code: "WELCOME10",
      type: "percent",
      value: 10,
      minOrder: 500000,
      maxDiscount: 200000,
      usageLimit: 500,
      used: 12,
      startAt: "2025-12-01T00:00:00.000Z",
      endAt: "2026-03-01T00:00:00.000Z",
      status: "active",
      createdAt: "2025-12-01T00:00:00.000Z",
      updatedAt: "2025-12-01T00:00:00.000Z",
    },
    {
      _id: "v2",
      code: "FREESHIP50",
      type: "fixed",
      value: 50000,
      minOrder: 300000,
      usageLimit: 300,
      used: 280,
      startAt: "2025-10-01T00:00:00.000Z",
      endAt: "2025-12-31T23:59:59.000Z",
      status: "expired",
      createdAt: "2025-10-01T00:00:00.000Z",
      updatedAt: "2025-10-01T00:00:00.000Z",
    },
  ],
};
