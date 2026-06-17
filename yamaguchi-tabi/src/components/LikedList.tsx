'use client';

import { Spot } from '@/types';

interface LikedListProps {
  likedSpots: Spot[];
  onClose: () => void;
  onPlanTrip: () => void;
}

export default function LikedList({ likedSpots, onClose, onPlanTrip }: LikedListProps) {
  const areaGroups = likedSpots.reduce<Record<string, Spot[]>>((acc, spot) => {
    if (!acc[spot.area]) acc[spot.area] = [];
    acc[spot.area].push(spot);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#F8F7F5' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: '#1E2A4A' }}>
        <button onClick={onClose} className="text-white text-2xl leading-none">←</button>
        <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'serif' }}>気になるリスト</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {likedSpots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">💭</div>
            <p className="text-gray-500 text-sm">まだ気になるスポットがありません。</p>
            <p className="text-gray-400 text-xs mt-1">右スワイプで追加してみましょう。</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: '#1E2A4A' }}>
              <span className="font-bold" style={{ color: '#C9A962' }}>{likedSpots.length}件</span>のスポットを選びました
            </p>

            {Object.entries(areaGroups).map(([area, spots]) => (
              <div key={area}>
                <h3 className="text-xs font-bold mb-2 px-1" style={{ color: '#1E2A4A', opacity: 0.5 }}>
                  📍 {area}
                </h3>
                <div className="space-y-2">
                  {spots.map((spot) => (
                    <div
                      key={spot.id}
                      className="flex gap-3 p-3 rounded-2xl bg-white shadow-sm"
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${spot.imageUrl})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate" style={{ color: '#1E2A4A' }}>
                          {spot.name}
                        </h4>
                        <p className="text-xs mt-0.5" style={{ color: '#C9A962' }}>{spot.category}</p>
                        <p className="text-xs mt-1 text-gray-500 line-clamp-2">{spot.description}</p>

                        {/* Mini scores */}
                        <div className="flex gap-2 mt-2">
                          {[
                            { key: 'connection', label: '人', color: '#C9A962' },
                            { key: 'slowness', label: '余', color: '#4A7C6F' },
                            { key: 'takehome', label: '持', color: '#7C4A6F' },
                            { key: 'senses', label: '五', color: '#4A6A7C' },
                          ].map(({ key, label, color }) => {
                            const score = spot.richScore[key as keyof typeof spot.richScore];
                            return (
                              <div key={key} className="flex items-center gap-0.5">
                                <span className="text-xs" style={{ color, opacity: 0.7 }}>{label}</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <span key={i} style={{ color: i <= score ? color : '#e0e0e0', fontSize: '8px' }}>●</span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      {likedSpots.length >= 3 && (
        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={onPlanTrip}
            className="w-full py-4 rounded-2xl font-bold text-white text-base"
            style={{ backgroundColor: '#1E2A4A' }}
          >
            <span style={{ color: '#C9A962' }}>✦</span> この{likedSpots.length}件で旅程を提案する
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">AIが豊かさスコアをもとに最適な旅程を作ります</p>
        </div>
      )}
    </div>
  );
}
