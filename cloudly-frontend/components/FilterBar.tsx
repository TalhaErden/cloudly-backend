"use client";

import React from 'react';
import { useStore } from '@/store/useStore';

export default function FilterBar() {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Ürün Analizleri</h2>
        <p className="text-sm text-gray-500">
          Toplam {categories.length - 1} kategori inceleniyor
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Kategori Filtrele:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5 outline-none transition-all"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}