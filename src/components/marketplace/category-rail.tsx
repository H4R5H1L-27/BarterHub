'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Headphones,
  Keyboard,
  Camera,
  Dices,
  Repeat,
  Smartphone,
} from 'lucide-react';
import { MARKET_CATEGORIES } from '@/lib/catalog';

const icons = {
  book: BookOpen,
  textbook: GraduationCap,
  audio: Headphones,
  keyboard: Keyboard,
  camera: Camera,
  game: Dices,
  swap: Repeat,
  phone: Smartphone,
};

export default function CategoryRail() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
      {MARKET_CATEGORIES.map((cat) => {
        const Icon = icons[cat.icon];
        return (
          <Link
            key={cat.slug}
            href={cat.href}
            className="group flex flex-col items-center gap-2.5 p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-2xs">
              <Icon className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-on-surface text-center leading-tight group-hover:text-primary transition-colors">{cat.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
