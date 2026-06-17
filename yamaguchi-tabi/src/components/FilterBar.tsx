'use client';

import { Area, Category } from '@/types';

const AREAS: (Area | 'すべて')[] = ['すべて', '萩', '山口市', '下関', '宇部', '周南', '岩国', '長門', '美祢', '防府', '柳井'];
const CATEGORIES: (Category | 'すべて')[] = ['すべて', '歴史・文化', '自然・絶景', '食・体験', '温泉・癒し', '工芸・ものづくり', '海・水辺'];

interface FilterBarProps {
  selectedArea: Area | 'すべて';
  selectedCategory: Category | 'すべて';
  onAreaChange: (area: Area | 'すべて') => void;
  onCategoryChange: (cat: Category | 'すべて') => void;
}

export default function FilterBar({ selectedArea, selectedCategory, onAreaChange, onCategoryChange }: FilterBarProps) {
  return (
    <div className="space-y-2">
      {/* Area filter */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => onAreaChange(area as Area | 'すべて')}
              className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full font-medium transition-all"
              style={{
                backgroundColor: selectedArea === area ? '#1E2A4A' : 'rgba(255,255,255,0.8)',
                color: selectedArea === area ? '#C9A962' : '#1E2A4A',
                border: selectedArea === area ? '1px solid #1E2A4A' : '1px solid rgba(30,42,74,0.2)',
              }}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat as Category | 'すべて')}
              className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full font-medium transition-all"
              style={{
                backgroundColor: selectedCategory === cat ? '#C9A962' : 'rgba(255,255,255,0.8)',
                color: selectedCategory === cat ? '#ffffff' : '#1E2A4A',
                border: selectedCategory === cat ? '1px solid #C9A962' : '1px solid rgba(201,169,98,0.3)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
