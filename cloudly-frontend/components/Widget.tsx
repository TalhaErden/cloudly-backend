"use client";

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ArrowUpRight, DollarSign, Package } from 'lucide-react';
import { Product } from '@/store/useStore'; // Store'dan tipi çektik

// Widget Tipi Tanımları (Polimorfizm burada başlıyor)
interface WidgetProps {
  type: 'chart' | 'table' | 'stat';
  title: string;
  data: Product[]; // Widget hangi veriyi kullanacak?
}

export default function Widget({ type, title, data }: WidgetProps) {
  
  // --- 1. İSTATİSTİK KARTI (STAT) ---
  // Toplam Ürün Değeri (Fiyat * Stok) [Kaynak: 58]
  if (type === 'stat') {
    const totalValue = data.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
    const totalStock = data.reduce((acc, curr) => acc + curr.stock, 0);

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              ${totalValue.toLocaleString()}
            </p>
            <p className="text-xs text-green-500 mt-1 flex items-center">
              <ArrowUpRight size={14} className="mr-1" />
              {totalStock} ürün stokta
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <DollarSign size={24} />
          </div>
        </div>
      </div>
    );
  }

  // --- 2. GRAFİK (CHART) ---
  // Kategorilere göre veya ürün bazlı stok dağılımı [Kaynak: 54]
  if (type === 'chart') {
    // Grafikte çok fazla veri olmaması için ilk 10 ürünü gösterelim
    const chartData = data.slice(0, 10).map(p => ({
      name: p.title.substring(0, 15) + '...', // İsimler çok uzun olmasın
      stock: p.stock,
      price: p.price
    }));

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
        <h3 className="text-gray-800 font-semibold mb-4">{title}</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Stok Adedi" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // --- 3. TABLO (TABLE) ---
  // En pahalı 5 ürün [Kaynak: 57]
  if (type === 'table') {
    // Fiyata göre sırala ve ilk 5'i al
    const sortedData = [...data].sort((a, b) => b.price - a.price).slice(0, 5);

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full overflow-hidden">
        <h3 className="text-gray-800 font-semibold mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-4">Ürün</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 truncate max-w-[150px]">
                    {product.title}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{product.category}</td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    ${product.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}