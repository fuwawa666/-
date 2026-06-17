'use client';

import { useState, useMemo } from 'react';
import { spots as allSpots } from '@/data/spots';
import { Area, Category, Spot } from '@/types';
import SwipeCard from '@/components/SwipeCard';
import FilterBar from '@/components/FilterBar';
import LikedList from '@/components/LikedList';
import PlanTrip from '@/components/PlanTrip';

export default function SwipePage() {
  const [selectedArea, setSelectedArea] = useState<Area | 'すべて'>('すべて');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'すべて'>('すべて');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedSpots, setLikedSpots] = useState<Spot[]>([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [showLiked, setShowLiked] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [lastAction, setLastAction] = useState<'left' | 'right' | null>(null);

  const filteredSpots = useMemo(() => {
    return allSpots.filter((s) => {
      const areaMatch = selectedArea === 'すべて' || s.area === selectedArea;
      const catMatch = selectedCategory === 'すべて' || s.category === selectedCategory;
      return areaMatch && catMatch;
    });
  }, [selectedArea, selectedCategory]);

  const remainingSpots = filteredSpots.slice(currentIndex);
  const isDone = currentIndex >= filteredSpots.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    const spot = filteredSpots[currentIndex];
    if (direction === 'right') {
      setLikedSpots((prev) => [...prev, spot]);
    } else {
      setSkippedCount((c) => c + 1);
    }
    setLastAction(direction);
    setCurrentIndex((i) => i + 1);
  };

  const handleButton = (direction: 'left' | 'right') => {
    if (isDone) return;
    handleSwipe(direction);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLikedSpots([]);
    setSkippedCount(0);
    setLastAction(null);
    setShowLiked(false);
    setShowPlan(false);
  };

  const handleFilterChange = () => {
    setCurrentIndex(0);
    setLastAction(null);
  };

  const handleAreaChange = (area: Area | 'すべて') => {
    setSelectedArea(area);
    handleFilterChange();
  };

  const handleCategoryChange = (cat: Category | 'すべて') => {
    setSelectedCategory(cat);
    handleFilterChange();
  };

  if (showPlan) {
    return (
      <PlanTrip
        likedSpots={likedSpots}
        onClose={() => setShowPlan(false)}
        onReset={handleReset}
      />
    );
  }

  if (showLiked) {
    return (
      <LikedList
        likedSpots={likedSpots}
        onClose={() => setShowLiked(false)}
        onPlanTrip={() => {
          setShowLiked(false);
          setShowPlan(true);
        }}
      />
    );
  }

  return (
    <main
      className="flex flex-col h-dvh overflow-hidden"
      style={{ backgroundColor: '#F8F7F5', maxWidth: '430px', margin: '0 auto' }}
    >
      {/* Header */}
      <header className="px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="font-bold text-xl leading-tight" style={{ color: '#1E2A4A', fontFamily: 'serif' }}>
              山口の旅を<span style={{ color: '#C9A962' }}>選ぶ</span>
            </h1>
            <p className="text-xs" style={{ color: 'rgba(30,42,74,0.5)' }}>
              気になったら右へ、スキップは左へ
            </p>
          </div>
          <button
            onClick={() => setShowLiked(true)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ backgroundColor: '#1E2A4A' }}
          >
            <span className="text-sm">♡</span>
            <span className="text-sm font-bold" style={{ color: '#C9A962' }}>{likedSpots.length}</span>
            {likedSpots.length >= 3 && (
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: '#C9A962' }}
              />
            )}
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(30,42,74,0.1)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${filteredSpots.length > 0 ? (currentIndex / filteredSpots.length) * 100 : 0}%`,
                backgroundColor: '#C9A962',
              }}
            />
          </div>
          <span className="text-xs" style={{ color: 'rgba(30,42,74,0.5)' }}>
            {currentIndex}/{filteredSpots.length}
          </span>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 text-xs mb-2"
          style={{ color: 'rgba(30,42,74,0.6)' }}
        >
          <span>{showFilters ? '▲' : '▼'}</span>
          <span>エリア・カテゴリで絞り込む</span>
          {(selectedArea !== 'すべて' || selectedCategory !== 'すべて') && (
            <span
              className="ml-1 px-1.5 py-0.5 rounded-full text-white text-xs"
              style={{ backgroundColor: '#C9A962' }}
            >
              絞込中
            </span>
          )}
        </button>

        {showFilters && (
          <FilterBar
            selectedArea={selectedArea}
            selectedCategory={selectedCategory}
            onAreaChange={handleAreaChange}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </header>

      {/* Card area */}
      <div className="flex-1 relative px-5 min-h-0">
        {isDone ? (
          /* All done */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="text-5xl mb-4">🎌</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1E2A4A', fontFamily: 'serif' }}>
              すべて見ました
            </h2>
            <p className="text-sm mb-1" style={{ color: 'rgba(30,42,74,0.6)' }}>
              気になる：<span style={{ color: '#C9A962', fontWeight: 'bold' }}>{likedSpots.length}件</span>
              　スキップ：{skippedCount}件
            </p>
            <div className="mt-6 space-y-3 w-full max-w-xs">
              {likedSpots.length >= 3 && (
                <button
                  onClick={() => setShowPlan(true)}
                  className="w-full py-4 rounded-2xl font-bold text-white"
                  style={{ backgroundColor: '#1E2A4A' }}
                >
                  旅程を提案してもらう →
                </button>
              )}
              <button
                onClick={() => setShowLiked(true)}
                className="w-full py-3 rounded-2xl font-bold border"
                style={{ borderColor: '#1E2A4A', color: '#1E2A4A' }}
              >
                気になるリストを見る（{likedSpots.length}件）
              </button>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-2xl text-sm"
                style={{ color: 'rgba(30,42,74,0.5)' }}
              >
                最初からやり直す
              </button>
            </div>
          </div>
        ) : (
          /* Card stack */
          <div className="absolute inset-0">
            {remainingSpots.slice(0, 3).map((spot, i) => (
              <SwipeCard
                key={spot.id}
                spot={spot}
                onSwipe={handleSwipe}
                isTop={i === 0}
                stackIndex={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isDone && (
        <div className="flex-shrink-0 px-5 pb-6 pt-4">
          {/* Last action feedback */}
          {lastAction && (
            <p className="text-center text-xs mb-2" style={{ color: 'rgba(30,42,74,0.4)' }}>
              {lastAction === 'right'
                ? `✓ 「${filteredSpots[currentIndex - 1]?.name}」を気になるリストに追加`
                : `「${filteredSpots[currentIndex - 1]?.name}」をスキップ`}
            </p>
          )}
          <div className="flex items-center justify-center gap-8">
            {/* Skip */}
            <button
              onClick={() => handleButton('left')}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              style={{ backgroundColor: 'white', border: '2px solid rgba(244,67,54,0.3)' }}
            >
              <span className="text-2xl">✕</span>
            </button>

            {/* Info / liked count */}
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#1E2A4A', color: '#C9A962' }}
              >
                {likedSpots.length}
              </div>
              <span className="text-xs mt-1" style={{ color: 'rgba(30,42,74,0.4)' }}>気になる</span>
            </div>

            {/* Like */}
            <button
              onClick={() => handleButton('right')}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              style={{ backgroundColor: '#1E2A4A' }}
            >
              <span className="text-2xl" style={{ color: '#C9A962' }}>♡</span>
            </button>
          </div>

          {likedSpots.length >= 3 && (
            <button
              onClick={() => setShowPlan(true)}
              className="w-full mt-4 py-3 rounded-xl font-bold text-sm"
              style={{ backgroundColor: '#C9A962', color: '#1E2A4A' }}
            >
              ✦ {likedSpots.length}件で旅程を提案する
            </button>
          )}
        </div>
      )}
    </main>
  );
}
