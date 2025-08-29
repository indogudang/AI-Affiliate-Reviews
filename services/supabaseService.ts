
import { Product, Review, User } from '../types';

// --- MOCK DATA ---
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'AeroGlide Wireless Mouse',
    imageUrl: 'https://picsum.photos/seed/mouse/600/400',
    price: 79.99,
    affiliateLink: '#',
    description: 'Experience ultimate freedom with the AeroGlide wireless mouse. Featuring a 2400 DPI sensor, ergonomic design, and a 70-hour battery life, it\'s perfect for both work and play.'
  },
  {
    id: '2',
    name: 'ChronoKey Mechanical Keyboard',
    imageUrl: 'https://picsum.photos/seed/keyboard/600/400',
    price: 149.50,
    affiliateLink: '#',
    description: 'The ChronoKey offers a premium typing experience with its clicky mechanical switches, customizable RGB backlighting, and a solid aluminum frame. Built to last and impress.'
  },
  {
    id: '3',
    name: 'CrystalView 4K Monitor',
    imageUrl: 'https://picsum.photos/seed/monitor/600/400',
    price: 499.00,
    affiliateLink: '#',
    description: 'Immerse yourself in stunning detail with the CrystalView 4K monitor. Its 27-inch IPS panel delivers vibrant colors and wide viewing angles, making it ideal for creative professionals.'
  },
  {
    id: '4',
    name: 'SoundSphere Bluetooth Speaker',
    imageUrl: 'https://picsum.photos/seed/speaker/600/400',
    price: 120.00,
    affiliateLink: '#',
    description: 'Take your music anywhere with the SoundSphere. This portable speaker provides 360-degree audio, a waterproof design, and 12 hours of playtime on a single charge.'
  },
  {
    id: '5',
    name: 'NovaStream HD Webcam',
    imageUrl: 'https://picsum.photos/seed/webcam/600/400',
    price: 89.99,
    affiliateLink: '#',
    description: 'Look your best on video calls with the NovaStream webcam. It streams in crisp 1080p at 60fps, features autofocus, and has dual microphones for clear audio.'
  },
  {
    id: '6',
    name: 'ErgoComfort Office Chair',
    imageUrl: 'https://picsum.photos/seed/chair/600/400',
    price: 350.00,
    affiliateLink: '#',
    description: 'Support your posture during long workdays with the ErgoComfort chair. It offers adjustable lumbar support, armrests, and a breathable mesh back for all-day comfort.'
  },
];

let mockReviews: Review[] = [
  {
    id: '101',
    productId: '1',
    author: 'user@example.com',
    content: 'This mouse is incredibly comfortable to use for long periods. The battery life is also a huge plus. Highly recommend it!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isAI: false,
  },
  {
    id: '102',
    productId: '1',
    author: 'Gemini AI',
    content: 'The AeroGlide Wireless Mouse delivers on its promises of comfort and longevity, making it a stellar choice for professionals. Its ergonomic shape fits the hand naturally, reducing fatigue during extended use. While the sensor is highly accurate, the software for customization could be more intuitive for beginners. Overall, it’s a top-tier peripheral for anyone seeking reliable and comfortable navigation.',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    isAI: true,
  },
  {
    id: '201',
    productId: '2',
    author: 'dev@example.com',
    content: 'The typing feel is fantastic, and the build quality is top-notch. The RGB lighting is very vibrant.',
    createdAt: new Date().toISOString(),
    isAI: false,
  }
];

// --- MOCK SUPABASE CLIENT ---

const MOCK_DELAY = 500; // 500ms delay to simulate network latency

const mockDbClient = {
  getProducts: (): Promise<Product[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockProducts]), MOCK_DELAY));
  },
  getProductById: (id: string): Promise<Product | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(mockProducts.find(p => p.id === id)), MOCK_DELAY));
  },
  getReviewsByProductId: (productId: string): Promise<Review[]> => {
    return new Promise(resolve => {
      const reviews = mockReviews
        .filter(r => r.productId === productId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTimeout(() => resolve(reviews), MOCK_DELAY);
    });
  },
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    return new Promise(resolve => {
      const newReview: Review = {
        ...reviewData,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      };
      mockReviews.push(newReview);
      setTimeout(() => resolve(newReview), MOCK_DELAY);
    });
  }
};

const mockAuthClient = {
  // Simulate a logged-in user with session storage
  _user: JSON.parse(sessionStorage.getItem('mockUser') || 'null'),
  
  signIn: (email: string, password: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (password === 'password123') {
          const user: User = { id: 'user-123', email: email };
          sessionStorage.setItem('mockUser', JSON.stringify(user));
          mockAuthClient._user = user;
          resolve(user);
        } else {
          reject(new Error('Invalid password'));
        }
      }, MOCK_DELAY);
    });
  },
  signOut: (): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        sessionStorage.removeItem('mockUser');
        mockAuthClient._user = null;
        resolve();
      }, MOCK_DELAY);
    });
  },
  getUser: (): Promise<User | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockAuthClient._user);
        }, 100); // Faster check
    });
  }
};

export const supabase = {
  ...mockDbClient,
  auth: mockAuthClient,
};
