import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('slice_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart collection to localStorage on updates
  useEffect(() => {
    localStorage.setItem('slice_cart', JSON.stringify(cart));
  }, [cart]);

  // Add Item to Cart
  const addToCart = (pizza, customization, size = 'Medium', quantity = 1) => {
    // Generate a unique identifier for this customized unit configuration
    const cartItemId = `${pizza._id}_${size}_${customization.base}_${customization.sauce}_${customization.cheese}_${(customization.veggies || []).join('-')}_${(customization.meat || []).join('-')}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        // Increment quantity of already existing customized item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add as a new customized entry
        return [
          ...prevCart,
          {
            cartItemId,
            pizzaId: pizza._id,
            name: pizza.name,
            description: pizza.description,
            price: pizza.price, // baseline catalog price
            category: pizza.category,
            image: pizza.image,
            size,
            quantity,
            customization: {
              base: customization.base,
              sauce: customization.sauce,
              cheese: customization.cheese,
              veggies: customization.veggies || [],
              meat: customization.meat || [],
            },
          },
        ];
      }
    });
  };

  // Remove Item from Cart
  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  // Update item quantity
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  // Wipe active cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate Subtotal dynamically (incorporating custom toppings additions)
  // Wait: this helper will calculate the subtotal locally by aggregating standard prices and custom ingredients prices.
  // We can pass the full dynamic customizationOptions metadata into the calculation or just let each item store its price.
  // In our flow, during customization, the frontend customizer page will compute the dynamic price for each item,
  // and we'll save that final dynamic item cost on addition to the cart! That's incredibly elegant and solid.
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
