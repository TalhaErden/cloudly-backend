"use client";

import Dashboard from '@/components/Dashboard';
import FilterBar from '@/components/FilterBar';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Üst Başlık ve Filtre Alanı */}
      <FilterBar />

      {/* Sürükle-Bırak Dashboard Alanı */}
      <Dashboard />
    </main>
  );
}