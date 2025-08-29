
export interface Product {
  id: string; // uuid
  name: string;
  image_url: string;
  price: number;
  affiliate_link: string;
  description: string;
  created_at: string;
}

export interface Review {
  id: string; // uuid
  product_id: string;
  author: string;
  content: string;
  created_at: string;
  is_ai: boolean;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

export type SortOrder = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
