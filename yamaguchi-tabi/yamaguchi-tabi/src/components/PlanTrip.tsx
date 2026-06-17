'use client';

import { Spot } from '@/types';

interface PlanTripProps {
  likedSpots: Spot[];
  onClose: () => void;
  onReset: () => void;
}

export default function PlanTrip({ likedSpots, onClose, onReset }: PlanTripProps) {
  const avgScores = {
    connection: Math.round(likedSpots.reduce((s, sp) => s + sp.richScore.connection, 0) / likedSpots.length),
    slowness: Math.round(likedSpots.reduce((s, sp) => s + sp.richScore.slowness, 0) / likedSpots.length),
    takehome: Math.round(likedSpots.reduce((s, sp) => s + sp.richScore.takehome, 0) / likedSpots.length),
    senses: Math.round(likedSpots.reduce((s, sp) => s + sp.richScore.senses, 0) / likedSpots.length),
  };

  const topScore = Object.entries(avgScores).sort((a, b) => b[1] - a[1])[0];
  const scoreProfiles: Record<string, { label: string; desc: string; emoji: string }> = {
    connection: { label: '人との交流を求める旅人', desc: '地元の人との会話や交流から旅の豊かさを見つけるタイプです。', emoji: '🤝' },
    slowness: { label: '余白を愛する旅人', desc: '急がず、ぼんやりする時間こそが旅の醍醐味だと知っているタイプです。', emoji: '🌿' },
    takehome: { label: '記憶と物語を持ち帰る旅人', desc: '旅が終わってからも日常の中で旅を生き続けるタイプです。', emoji: '✨' },
    senses: { label: '五感で旅するタイプ', desc: '見る、聴く、触れる、味わう——全感覚で場所を体験するタイプです。', emoji: '🌸' },
  };

  const profile = scoreProfiles[topScore[0]];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#1E2A4A' }}>
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              backgroundColor: '#C9A962',
              opacity: Math.random() * 0.5 + 0.1,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">{profile.emoji}</div>
        <h1 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
          あなたは
        </h1>
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#C9A962', fontFamily: 'serif' }}>
          {profile.label}
        </h2>
        <p className="text-white text-opacity-70 text-sm leading-relaxed mb-8 max-w-xs">
          {profile.desc}
        </p>

        {/* Score bars */}
        <div className="w-full max-w-xs bg-white bg-opacity-5 rounded-2xl p-4 mb-8">
          <p className="text-white text-opacity-50 text-xs mb-3">あなたの豊かさスコア</p>
          {[
            { key: 'connection', label: '人との接点', color: '#C9A962' },
            { key: 'slowness', label: '余白', color: '#4A7C6F' },
            { key: 'takehome', label: '持ち帰り', color: '#7C4A6F' },
            { key: 'senses', label: '五感', color: '#4A6A7C' },
          ].map(({ key, label, color }) => {
            const score = avgScores[key as keyof typeof avgScores];
            return (
              <div key={key} className="flex items-center gap-3 mb-2">
                <span className="text-white text-opacity-60 text-xs w-20 text-right">{label}</span>
                <div className="flex-1 h-2 rounded-full bg-white bg-opacity-10">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(score / 5) * 100}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-white text-xs w-4">{score}</span>
              </div>
            );
          })}
        </div>

        <p className="text-white text-opacity-50 text-xs mb-6">
          選んだ{likedSpots.length}件のスポットをもとに<br />AIが旅程を生成します（近日公開）
        </p>

        <div className="space-y-3 w-full max-w-xs">
          <button
            className="w-full py-4 rounded-2xl font-bold text-sm"
            style={{ backgroundColor: '#C9A962', color: '#1E2A4A' }}
            onClick={onReset}
          >
            最初からやり直す
          </button>
          <button
            className="w-full py-3 rounded-2xl font-bold text-sm border"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
            onClick={onClose}
          >
            リストに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
