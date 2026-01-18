import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  brand?: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface AppliedVoucher {
  code: string;
  discount: number;
}

interface CartContextType {
  items: CartItem[];

  // voucher
  voucher: AppliedVoucher | null;
  setVoucher: (v: AppliedVoucher | null) => void;
  clearVoucher: () => void;

  // cart actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;

  // totals
  getTotalItems: () => number;
  getSubTotal: () => number;
  getDiscount: () => number;
  getTotalPrice: () => number;

  // helpers
  replaceCart: (newItems: CartItem[]) => void;
  getItemByVariant: (variantId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "cart-storage";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [voucher, setVoucher] = useState<AppliedVoucher | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (isLoaded) saveCart();
  }, [items, voucher, isLoaded]);

  const loadCart = async () => {
    try {
      const stored =
        Platform.OS === "web"
          ? localStorage.getItem(CART_STORAGE_KEY)
          : await AsyncStorage.getItem(CART_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed.state?.items || []);
        setVoucher(parsed.state?.voucher || null);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCart = async () => {
    try {
      const data = JSON.stringify({ state: { items, voucher } });
      if (Platform.OS === "web") {
        localStorage.setItem(CART_STORAGE_KEY, data);
      } else {
        await AsyncStorage.setItem(CART_STORAGE_KEY, data);
      }
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.variantId === item.variantId,
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (variantId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.variantId === variantId ? { ...i, quantity } : i,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    setVoucher(null);
  };

  const replaceCart = (newItems: CartItem[]) => {
    setItems(newItems);
  };

  const getItemByVariant = (variantId: string) => {
    return items.find((i) => i.variantId === variantId);
  };

  const clearVoucher = () => setVoucher(null);

  // totals
  const getTotalItems = () => items.reduce((t, i) => t + i.quantity, 0);
  const getSubTotal = () => items.reduce((t, i) => t + i.price * i.quantity, 0);
  const getDiscount = () => voucher?.discount ?? 0;
  const getTotalPrice = () => Math.max(0, getSubTotal() - getDiscount());

  const value = useMemo<CartContextType>(
    () => ({
      items,

      voucher,
      setVoucher,
      clearVoucher,

      addItem,
      removeItem,
      updateQuantity,
      clearCart,

      getTotalItems,
      getSubTotal,
      getDiscount,
      getTotalPrice,

      replaceCart,
      getItemByVariant,
    }),
    [items, voucher],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
