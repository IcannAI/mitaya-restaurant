import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Language, CartItem, MenuItem, CartItemsSchema } from '../types';
import { TRANSLATIONS } from '../constants';
import { safeRead, safeWrite } from '../lib/safeStorage';
import { useCartStore, useLanguageStore } from '../store';
import i18n from '../lib/i18n';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Language from Zustand
  const { language, setLanguage } = useLanguageStore();

  const t = (key: string) => {
    return i18n.t(key);
  };

  // Cart from Zustand
  const { items: cart, addItem, removeItem, updateQty, total: cartTotal } = useCartStore();
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: MenuItem) => {
    addItem(item);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    removeItem(itemId);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const item = cart.find(i => i.id === itemId);
    if (item) {
      updateQty(itemId, item.quantity + delta);
    }
  };

  const contextValue = useMemo(() => ({
    language, setLanguage, t: t as any,
    cart, addToCart, removeFromCart, updateQuantity, cartTotal,
    isCartOpen, setIsCartOpen
  }), [language, cart, cartTotal, isCartOpen]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};