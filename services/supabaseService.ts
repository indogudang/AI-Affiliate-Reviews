
import { Product, Review, User } from '../types';
import { supabaseClient } from './supabaseClient';
import type { Session, Subscription } from '@supabase/supabase-js';

const dbClient = {
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Product[];
  },

  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Review[];
  },

  addReview: async (reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
    const { data, error } = await supabaseClient
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
      
    if (error) throw error;
    return data as Review;
  },

  invokeCreateProductsFromAi: async (topic: string): Promise<any> => {
    const { data, error } = await supabaseClient.functions.invoke('create-products-from-ai', {
        body: { topic },
    });
    if (error) throw error;
    return data;
  }
};

const authClient = {
  signIn: async (email: string, password: string): Promise<User | null> => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user) return null;
    return {
      id: data.user.id,
      email: data.user.email!,
    };
  },
  
  signUp: async (email: string, password: string): Promise<User | null> => {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    if(!data.user) return null;
    return {
        id: data.user.id,
        email: data.user.email!,
    };
  },

  signOut: (): Promise<{ error: Error | null }> => {
    return supabaseClient.auth.signOut();
  },

  onAuthStateChange: (callback: (event: string, session: Session | null) => void): { data: { subscription: Subscription } } => {
      return supabaseClient.auth.onAuthStateChange(callback);
  }
};

export const supabase = {
  ...dbClient,
  auth: authClient,
};
