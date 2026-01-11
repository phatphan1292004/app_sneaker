import React, { createContext, useContext, useMemo, useState } from "react";
import type {
  AdminState,
  Brand,
  ID,
  Order,
  Product,
  User,
  Variant,
  Voucher,
} from "../../types/admin";
import { seedState } from "./seed";

type AdminActions = {
  // loading mock
  boot: () => Promise<void>;
  isBooted: boolean;

  // users
  addUser: (u: Omit<User, "_id" | "createdAt" | "updatedAt">) => void;
  updateUser: (id: ID, patch: Partial<User>) => void;
  removeUser: (id: ID) => void;

  // brands
  addBrand: (b: Omit<Brand, "_id" | "createdAt" | "updatedAt">) => void;
  updateBrand: (id: ID, patch: Partial<Brand>) => void;
  removeBrand: (id: ID) => void;

  // products
  addProduct: (p: Omit<Product, "_id" | "createdAt" | "updatedAt">) => void;
  updateProduct: (id: ID, patch: Partial<Product>) => void;
  removeProduct: (id: ID) => void;

  // variants
  addVariant: (v: Omit<Variant, "_id" | "updatedAt">) => void;
  updateVariant: (id: ID, patch: Partial<Variant>) => void;
  removeVariant: (id: ID) => void;

  // orders
  updateOrder: (id: ID, patch: Partial<Order>) => void;
  removeOrder: (id: ID) => void;

  // vouchers
  addVoucher: (v: Omit<Voucher, "_id" | "createdAt" | "updatedAt">) => void;
  updateVoucher: (id: ID, patch: Partial<Voucher>) => void;
  removeVoucher: (id: ID) => void;
};

type CtxType = { state: AdminState; actions: AdminActions };

const Ctx = createContext<CtxType | null>(null);

const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);
const nowISO = () => new Date().toISOString();

export function AdminStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AdminState>(seedState);
  const [isBooted, setIsBooted] = useState(false);

  const actions: AdminActions = useMemo(
    () => ({
      isBooted,
      boot: async () => {
        setIsBooted(false);
        await new Promise((r) => setTimeout(r, 700));
        setIsBooted(true);
      },

      addUser: (u) =>
        setState((s) => ({
          ...s,
          users: [
            { _id: uid(), ...u, createdAt: nowISO(), updatedAt: nowISO() },
            ...s.users,
          ],
        })),
      updateUser: (id, patch) =>
        setState((s) => ({
          ...s,
          users: s.users.map((x) =>
            x._id === id ? { ...x, ...patch, updatedAt: nowISO() } : x
          ),
        })),
      removeUser: (id) =>
        setState((s) => ({ ...s, users: s.users.filter((x) => x._id !== id) })),

      addBrand: (b) =>
        setState((s) => ({
          ...s,
          brands: [
            { _id: uid(), ...b, createdAt: nowISO(), updatedAt: nowISO() },
            ...s.brands,
          ],
        })),
      updateBrand: (id, patch) =>
        setState((s) => ({
          ...s,
          brands: s.brands.map((x) =>
            x._id === id ? { ...x, ...patch, updatedAt: nowISO() } : x
          ),
        })),
      removeBrand: (id) =>
        setState((s) => ({
          ...s,
          brands: s.brands.filter((x) => x._id !== id),
          products: s.products.filter((p) => p.brand_id !== id),
        })),

      addProduct: (p) =>
        setState((s) => ({
          ...s,
          products: [
            { _id: uid(), ...p, createdAt: nowISO(), updatedAt: nowISO() },
            ...s.products,
          ],
        })),
      updateProduct: (id, patch) =>
        setState((s) => ({
          ...s,
          products: s.products.map((x) =>
            x._id === id ? { ...x, ...patch, updatedAt: nowISO() } : x
          ),
        })),
      removeProduct: (id) =>
        setState((s) => ({
          ...s,
          products: s.products.filter((x) => x._id !== id),
          variants: s.variants.filter((v) => v.product_id !== id),
        })),

      addVariant: (v) =>
        setState((s) => ({
          ...s,
          variants: [{ _id: uid(), ...v, updatedAt: nowISO() }, ...s.variants],
        })),
      updateVariant: (id, patch) =>
        setState((s) => ({
          ...s,
          variants: s.variants.map((x) =>
            x._id === id ? { ...x, ...patch, updatedAt: nowISO() } : x
          ),
        })),
      removeVariant: (id) =>
        setState((s) => ({
          ...s,
          variants: s.variants.filter((x) => x._id !== id),
        })),

      updateOrder: (id, patch) =>
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) =>
            o._id === id ? { ...o, ...patch, updatedAt: nowISO() } : o
          ),
        })),
      removeOrder: (id) =>
        setState((s) => ({
          ...s,
          orders: s.orders.filter((o) => o._id !== id),
        })),
      addVoucher: (v) =>
        setState((s) => ({
          ...s,
          vouchers: [
            { _id: uid(), ...v, createdAt: nowISO(), updatedAt: nowISO() },
            ...(s.vouchers ?? []),
          ],
        })),

      updateVoucher: (id, patch) =>
        setState((s) => ({
          ...s,
          vouchers: (s.vouchers ?? []).map((x) =>
            x._id === id ? { ...x, ...patch, updatedAt: nowISO() } : x
          ),
        })),

      removeVoucher: (id) =>
        setState((s) => ({
          ...s,
          vouchers: (s.vouchers ?? []).filter((x) => x._id !== id),
        })),
    }),

    [isBooted]
  );

  return <Ctx.Provider value={{ state, actions }}>{children}</Ctx.Provider>;
}

export function useAdminStore() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useAdminStore must be used inside AdminStoreProvider");
  return ctx;
}
