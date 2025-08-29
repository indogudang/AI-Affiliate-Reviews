import React from 'react';
// FIX: Import the shared SortOrder type.
import { Product, SortOrder } from '../types';
import ProductGrid from './ProductGrid';

interface HomeProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  isLoading: boolean;
  // FIX: Use the strongly-typed SortOrder for props.
  sortOrder: SortOrder;
  onSortChange: (sortOrder: SortOrder) => void;
}

const Home: React.FC<HomeProps> = ({ products, onSelectProduct, isLoading, sortOrder, onSortChange }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Featured Products</h2>
        <div className="flex items-center space-x-2">
            <label htmlFor="sort-order" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Sort by:</label>
            <select
                id="sort-order"
                value={sortOrder}
                // FIX: Cast event value to SortOrder to match the expected type.
                onChange={(e) => onSortChange(e.target.value as SortOrder)}
                className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                aria-label="Sort products"
            >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
            </select>
        </div>
      </div>
      <ProductGrid 
        products={products} 
        onSelectProduct={onSelectProduct} 
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;