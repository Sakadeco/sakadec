import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { useLocation } from 'wouter';

const CartIcon: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Charger les éléments du panier depuis localStorage
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    loadCart();

    // Écouter les changements du panier
    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      onClick={() => setLocation('/cart')}
      className="relative p-2 text-gray-700 hover:text-gold transition-colors"
      aria-label="Panier"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center"
        >
          {totalItems}
        </Badge>
      )}
    </button>
  );
};

export default CartIcon;
