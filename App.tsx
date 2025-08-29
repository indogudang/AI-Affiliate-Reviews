
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, Review, User, AuthContextType } from './types';
import { supabase } from './services/supabaseService';
import { generateReview as generateAiReview } from './services/geminiService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import { AuthContext } from './contexts/AuthContext';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
    const checkUser = async () => {
      const user = await supabase.auth.getUser();
      setCurrentUser(user);
      setIsAuthLoading(false);
    };
    checkUser();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await supabase.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSelectProduct = useCallback(async (product: Product) => {
    setSelectedProduct(product);
    setIsLoading(true);
    setError(null);
    try {
      const productReviews = await supabase.getReviewsByProductId(product.id);
      setReviews(productReviews);
    } catch (err) {
      setError('Failed to fetch reviews.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGoBack = () => {
    setSelectedProduct(null);
    setReviews([]);
    fetchProducts();
  };

  const handleGenerateReview = useCallback(async () => {
    if (!selectedProduct) return;
    setIsLoading(true);
    try {
      const aiReviewContent = await generateAiReview(selectedProduct.name);
      const newReview = await supabase.addReview({
        productId: selectedProduct.id,
        author: 'Gemini AI',
        content: aiReviewContent,
        isAI: true,
      });
      setReviews(prev => [newReview, ...prev]);
    } catch (err) {
      setError('Failed to generate AI review.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct]);

  const handleSubmitReview = useCallback(async (content: string) => {
    if (!selectedProduct || !currentUser) return;
    setIsLoading(true);
    try {
      const newReview = await supabase.addReview({
        productId: selectedProduct.id,
        author: currentUser.email,
        content: content,
        isAI: false,
      });
      setReviews(prev => [newReview, ...prev]);
    } catch (err) {
      setError('Failed to submit review.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, currentUser]);

  const authContextValue: AuthContextType = useMemo(() => ({
    user: currentUser,
    isLoading: isAuthLoading,
    signIn: async (email, password) => {
      setIsAuthLoading(true);
      try {
        const user = await supabase.auth.signIn(email, password);
        setCurrentUser(user);
        return user;
      } finally {
        setIsAuthLoading(false);
      }
    },
    signOut: async () => {
      setIsAuthLoading(true);
      await supabase.auth.signOut();
      setCurrentUser(null);
      setIsAuthLoading(false);
    },
  }), [currentUser, isAuthLoading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col font-sans">
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              reviews={reviews}
              onBack={handleGoBack}
              onGenerateReview={handleGenerateReview}
              onSubmitReview={handleSubmitReview}
              isLoading={isLoading}
            />
          ) : (
            <ProductGrid products={products} onSelectProduct={handleSelectProduct} isLoading={isLoading} />
          )}
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
};

export default App;
