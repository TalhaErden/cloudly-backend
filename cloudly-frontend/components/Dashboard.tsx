"use client";

import React, { useEffect, useState } from 'react'; // <--- 1. useState EKLENDİİ
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '@/store/useStore';
import Widget from './Widget';

function SortableItem(props: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full">
      {props.children}
    </div>
  );
}

export default function Dashboard() {
  const { filteredProducts, isLoading, fetchProducts, error } = useStore();

  // Varsayılan sıralama
  const defaultOrder = ['stat-card', 'chart-widget', 'table-widget'];
  const [items, setItems] = useState<string[]>(defaultOrder);

  // --- 2. MOUNTED KONTROLÜ (YENİ KOD) ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchProducts();

    // --- LocalStorage'dan Oku ---
    const savedOrder = localStorage.getItem('dashboard-order');
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        // Güvenlik: beklenen bir array mi?
        if (Array.isArray(parsed) && parsed.length) {
          setItems(parsed);
        }
      } catch (e) {
        console.error('LocalStorage okuma hatası', e);
      }
    }
    // ---------------------------
  }, []);
  // --------------------------------------

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // --- LocalStorage'a Kaydet ---
        localStorage.setItem('dashboard-order', JSON.stringify(newOrder));
        // ----------------------------

        return newOrder;
      });
    }
  }

  // --- 3. SERVER-SIDE ENGELLEME (YENİ KOD) ---
  // Eğer sayfa henüz mount olmadıysa hiçbir şey gösterme (ID çakışmasını önler)
  if (!isMounted) {
    return null;
  }
  // ------------------------------------------

  if (isLoading) return <div className="text-center p-10">Veriler Yükleniyor...</div>;
  if (error) return <div className="text-red-500 text-center p-10">Hata: {error}</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((id) => (
            <SortableItem key={id} id={id}>
              <div className="h-full min-h-[300px]">
                {id === 'stat-card' && (
                  <Widget type="stat" title="Genel Bakış" data={filteredProducts} />
                )}
                {id === 'chart-widget' && (
                  <Widget type="chart" title="Stok Analizi" data={filteredProducts} />
                )}
                {id === 'table-widget' && (
                  <Widget type="table" title="Değerli Ürünler" data={filteredProducts} />
                )}
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
