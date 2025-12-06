import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  brand: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemByVariant: (variantId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "cart-storage";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveCart();
    }
  }, [items, isLoaded]);

  const loadCart = async () => {
    try {
      const stored =
        Platform.OS === "web"
          ? localStorage.getItem(CART_STORAGE_KEY)
          : await AsyncStorage.getItem(CART_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed.state?.items || []);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCart = async () => {
    try {
      const data = JSON.stringify({ state: { items } });
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
        (i) => i.variantId === item.variantId
      );

      let newItems;
      if (existingItem) {
        console.log("🛒 Updated quantity in cart:", {
          product: item.name,
          color: item.color,
          size: item.size,
          newQuantity: existingItem.quantity + 1,
        });
        newItems = prevItems.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...prevItems, { ...item, quantity: 1 }];
      }

      return newItems;
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
      prevItems.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemByVariant = (variantId: string) => {
    return items.find((i) => i.variantId === variantId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemByVariant,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
