import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserStats, Badge } from '../types';
import { BADGES, COLORS } from '../constants';

interface Props {
  stats: UserStats;
  onClose: () => void;
}

export const Rewards: React.FC<Props> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center font-bold"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: COLORS.primaryBlue }}>Your Treasure Chest</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Progress Chart */}
          <div className="bg-gray-50 p-4 rounded-xl border-2" style={{ borderColor: COLORS.primaryGreen }}>
            <h3 className="text-xl font-bold mb-4 text-center">Weekly Progress</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.history}>
                  <XAxis dataKey="day" tick={{fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {stats.history.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? COLORS.primaryBlue : COLORS.primaryYellow} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center mt-2 font-bold text-gray-500">Total Score: {stats.score}</p>
          </div>

          {/* Badges */}
          <div className="bg-gray-50 p-4 rounded-xl border-2" style={{ borderColor: COLORS.accentOrange }}>
            <h3 className="text-xl font-bold mb-4 text-center">Badges</h3>
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map((badge) => {
                const isUnlocked = stats.badges.includes(badge.id);
                return (
                  <div 
                    key={badge.id} 
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${isUnlocked ? 'bg-white opacity-100 scale-100' : 'bg-gray-200 opacity-50 grayscale'}`}
                    style={{ borderColor: isUnlocked ? badge.color : '#cbd5e0' }}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className="font-bold text-sm text-center">{badge.name}</div>
                    <div className="text-xs text-center text-gray-500 mt-1">{badge.criteria}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
