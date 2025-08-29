
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer group"
      onClick={() => onSelectProduct(product)}
    >
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">{product.name}</h3>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${product.price.toFixed(2)}</p>
        <button className="mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
