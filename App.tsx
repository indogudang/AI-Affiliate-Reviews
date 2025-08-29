
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, Review, User, AuthContextType, SortOrder } from './types';
import { supabase } from './services/supabaseService';
import { generateReview as generateAiReview } from './services/geminiService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import { AuthContext } from './contexts/AuthContext';
import Login from './components/Login';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';

type Page = 'home' | 'login' | 'admin';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<Page>('home');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
    
    setIsAuthLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            setCurrentUser({ id: session.user.id, email: session.user.email! });
            if (page === 'login') {
                setPage('home');
            }
        } else {
            setCurrentUser(null);
        }
        setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [page]);

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
      setError('Failed to fetch products from the database.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (page === 'home' && !selectedProduct) {
        fetchProducts();
    }
  }, [selectedProduct, fetchProducts, page]);

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
    setPage('home');
  };

  const handleNavigation = (targetPage: Page) => {
    if (targetPage === 'home') {
        setSelectedProduct(null);
    }
    setPage(targetPage);
  }

  const handleGenerateReview = useCallback(async () => {
    if (!selectedProduct) return;
    setIsLoading(true);
    try {
      const aiReviewContent = await generateAiReview(selectedProduct.name);
      const newReview = await supabase.addReview({
        product_id: selectedProduct.id,
        author: 'Gemini AI',
        content: aiReviewContent,
        is_ai: true,
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
        product_id: selectedProduct.id,
        author: currentUser.email,
        content: content,
        is_ai: false,
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
      const user = await supabase.auth.signIn(email, password);
      return user;
    },
    signUp: async (email, password) => {
      const user = await supabase.auth.signUp(email, password);
      return user;
    },
    signOut: async () => {
      await supabase.auth.signOut();
      setPage('home');
    },
  }), [currentUser, isAuthLoading]);
  
  const processedProducts = useMemo(() => {
    let filtered = products;
    if (searchQuery) {
      filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered];
    switch (sortOrder) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, searchQuery, sortOrder]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      </div>
    );
  }

  const renderContent = () => {
      if (selectedProduct) {
        return (
            <ProductDetail
              product={selectedProduct}
              reviews={reviews}
              onBack={handleGoBack}
              onGenerateReview={handleGenerateReview}
              onSubmitReview={handleSubmitReview}
              isLoading={isLoading}
            />
        );
      }

      if (page === 'login') {
          return <Login />;
      }
      
      if (page === 'admin') {
          return <AdminPanel onProductsGenerated={fetchProducts} />;
      }
      
      return (
            <Home
              products={processedProducts} 
              onSelectProduct={handleSelectProduct} 
              isLoading={isLoading}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
      );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col font-sans">
        <Navbar 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigate={handleNavigation}
        />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {renderContent()}
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
};

export default App;
