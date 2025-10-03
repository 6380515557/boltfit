import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  function addToCart(item) {
    setItems(prevItems => {
      const idx = prevItems.findIndex(
        i =>
          i.id === item.id &&
          i.selectedSize === item.selectedSize &&
          i.selectedColor === item.selectedColor
      );
      if (idx >= 0) {
        const updated = [...prevItems];
        updated[idx].quantity += item.quantity;
        // Prevent quantity from dropping below 1
        if (updated[idx].quantity <= 0) {
          updated.splice(idx, 1);
        }
        return updated;
      } else {
        // Add new item only if quantity > 0
        if (item.quantity > 0) {
          return [...prevItems, item];
        }
        return prevItems;
      }
    });
  }

  function removeFromCart(id, selectedSize, selectedColor) {
    setItems(prevItems =>
      prevItems.filter(
        item =>
          !(
            item.id === id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
  }

  function getTotalItems() {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}
