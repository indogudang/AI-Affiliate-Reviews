
export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  affiliateLink: string;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  content: string;
  createdAt: string;
  isAI: boolean;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}
