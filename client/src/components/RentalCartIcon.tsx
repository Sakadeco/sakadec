import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Calendar, ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';

const RentalCartIcon: React.FC = () => {
  const [, setLocation] = useLocation();
  const [rentalCartCount, setRentalCartCount] = useState(0);

  useEffect(() => {
    const updateRentalCartCount = () => {
      const rentalCart = JSON.parse(localStorage.getItem('rentalCart') || '[]');
      setRentalCartCount(rentalCart.length);
    };

    updateRentalCartCount();
    window.addEventListener('storage', updateRentalCartCount);
    window.addEventListener('rentalCartUpdated', updateRentalCartCount);

    return () => {
      window.removeEventListener('storage', updateRentalCartCount);
      window.removeEventListener('rentalCartUpdated', updateRentalCartCount);
    };
  }, []);

  return (
    <div 
      className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
      onClick={() => setLocation('/rental-cart')}
    >
      <Calendar className="w-5 h-5 text-orange-600" />
      {rentalCartCount > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center p-0"
        >
          {rentalCartCount}
        </Badge>
      )}
    </div>
  );
};

export default RentalCartIcon;
