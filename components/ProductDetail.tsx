
import React from 'react';
import { Product, Review } from '../types';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { SparklesIcon } from './icons/SparklesIcon';
import Button from './Button';

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  onBack: () => void;
  onGenerateReview: () => void;
  onSubmitReview: (content: string) => void;
  isLoading: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  reviews,
  onBack,
  onGenerateReview,
  onSubmitReview,
  isLoading,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Button onClick={onBack} className="mb-8">
        &larr; Back to Products
      </Button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover min-h-[300px]" />
          <div className="p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-4">{product.description}</p>
              <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-6">${product.price.toFixed(2)}</p>
            </div>
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full text-center bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              Buy Now
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews ({reviews.length})</h2>
          <Button
            onClick={onGenerateReview}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <SparklesIcon />
            {isLoading ? 'Generating...' : 'Generate AI Review'}
          </Button>
        </div>
        <div className="space-y-6">
          <ReviewForm onSubmit={onSubmitReview} isLoading={isLoading} />
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
