import { create } from 'zustand';

// 1. Veri Tiplerini Tanımlıyoruz
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  stock: number;
  thumbnail: string;
}

interface DashboardState {
  products: Product[];          // API'den gelen ham veri
  filteredProducts: Product[];  // Ekranda gösterilecek veri
  categories: string[];         // Filtre listesi
  selectedCategory: string;     // Seçili kategori
  isLoading: boolean;
  error: string | null;

  // Aksiyonlar
  fetchProducts: () => Promise<void>;
  setSelectedCategory: (category: string) => void;
  // Drag & Drop sonrası sıralamayı güncellemek için yeni aksiyon
  setFilteredProducts: (products: Product[]) => void;
}

// 2. Store'u Oluşturuyoruz
export const useStore = create<DashboardState>((set, get) => ({
  products: [],
  filteredProducts: [],
  categories: [],
  selectedCategory: 'All',
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // API'den 100 ürünü çekiyoruz
      const res = await fetch('https://dummyjson.com/products?limit=100');
      const data = await res.json();
      
      const products: Product[] = data.products;

      // Kategorileri ayıklıyoruz (Unique değerler)
      const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));

      set({
        products: products,
        filteredProducts: products, 
        categories: ['All', ...uniqueCategories], 
        isLoading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  setSelectedCategory: (category) => {
    const { products } = get();
    set({
      selectedCategory: category,
      filteredProducts:
        category === 'All'
          ? products
          : products.filter((p) => p.category === category),
    });
  },

  setFilteredProducts: (newProducts) => {
    set({ filteredProducts: newProducts });
  },
}));