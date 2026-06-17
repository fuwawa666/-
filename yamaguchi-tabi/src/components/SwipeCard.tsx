'use client';

import { useState, useRef, useEffect } from 'react';
import { Spot } from '@/types';

interface SwipeCardProps {
  spot: Spot;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
  stackIndex: number;
}

export default function SwipeCard({ spot, onSwipe, isTop, stackIndex }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [swipeIndicator, setSwipeIndicator] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 80;

  const getRotation = () => {
    if (!isDragging) return 0;
    return position.x * 0.1;
  };

  const getOpacity = () => {
    if (!isTop) return 1;
    const absX = Math.abs(position.x);
    return Math.max(1 - absX / 400, 0.3);
  };

  const handleStart = (clientX: number, clientY: number) => {
    if (!isTop) return;
    setIsDragging(true);
    setStartPos({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isTop) return;
    const newX = clientX - startPos.x;
    const newY = clientY - startPos.y;
    setPosition({ x: newX, y: newY });

    if (newX > 30) setSwipeIndicator('right');
    else if (newX < -30) setSwipeIndicator('left');
    else setSwipeIndicator(null);
  };

  const handleEnd = () => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);
    setSwipeIndicator(null);

    if (position.x > SWIPE_THRESHOLD) {
      animateOut('right');
    } else if (position.x < -SWIPE_THRESHOLD) {
      animateOut('left');
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const animateOut = (direction: 'left' | 'right') => {
    const targetX = direction === 'right' ? 600 : -600;
    setPosition({ x: targetX, y: position.y });
    setTimeout(() => {
      onSwipe(direction);
      setPosition({ x: 0, y: 0 });
    }, 300);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) e.preventDefault();
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchEnd = () => handleEnd();

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, position, startPos]);

  const stackOffset = stackIndex * 6;
  const stackScale = 1 - stackIndex * 0.04;

  const scoreLabels = [
    { key: 'connection', label: '人', color: '#C9A962' },
    { key: 'slowness', label: '余', color: '#4A7C6F' },
    { key: 'takehome', label: '持', color: '#7C4A6F' },
    { key: 'senses', label: '五', color: '#4A6A7C' },
  ];

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 select-none"
      style={{
        transform: isTop
          ? `translateX(${position.x}px) translateY(${position.y}px) rotate(${getRotation()}deg)`
          : `translateY(${stackOffset}px) scale(${stackScale})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        zIndex: 10 - stackIndex,
        cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default',
        opacity: isTop ? getOpacity() : 0.9,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${spot.imageUrl})` }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Swipe indicators */}
        {isTop && swipeIndicator === 'right' && (
          <div
            className="absolute top-8 left-6 px-4 py-2 rounded-xl border-4 font-bold text-2xl"
            style={{
              borderColor: '#4CAF50',
              color: '#4CAF50',
              opacity: Math.min(Math.abs(position.x) / 80, 1),
              transform: 'rotate(-15deg)',
            }}
          >
            気になる ♡
          </div>
        )}
        {isTop && swipeIndicator === 'left' && (
          <div
            className="absolute top-8 right-6 px-4 py-2 rounded-xl border-4 font-bold text-2xl"
            style={{
              borderColor: '#f44336',
              color: '#f44336',
              opacity: Math.min(Math.abs(position.x) / 80, 1),
              transform: 'rotate(15deg)',
            }}
          >
            スキップ ✕
          </div>
        )}

        {/* Rain OK badge */}
        {spot.rainOk && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            ☂️ 雨でもOK
          </div>
        )}

        {/* Rich score badges */}
        <div className="absolute top-4 left-4 flex gap-1">
          {scoreLabels.map(({ key, label, color }) => {
            const score = spot.richScore[key as keyof typeof spot.richScore];
            return (
              <div
                key={key}
                className="text-white text-xs font-bold px-2 py-1 rounded-full flex flex-col items-center"
                style={{ backgroundColor: color + 'CC', minWidth: '32px' }}
              >
                <span style={{ fontSize: '10px' }}>{label}</span>
                <span>{'★'.repeat(score)}</span>
              </div>
            );
          })}
        </div>

        {/* Info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Tags */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {spot.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: 'rgba(201,169,98,0.7)' }}
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-white text-2xl font-bold leading-tight" style={{ fontFamily: 'serif' }}>
                {spot.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white text-opacity-80 text-sm">📍 {spot.area}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  {spot.category}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white text-opacity-90 text-sm mt-3 leading-relaxed line-clamp-3">
            {spot.description}
          </p>
        </div>
      </div>
    </div>
  );
}
