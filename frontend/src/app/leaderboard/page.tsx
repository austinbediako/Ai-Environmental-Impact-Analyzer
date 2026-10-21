'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface LeaderboardUser {
  _id: string;
  name: string;
  points: number;
  level: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/auth/leaderboard')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => console.error("Failed to fetch leaderboard", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex justify-center items-center gap-3">
          <Trophy className="w-10 h-10 text-yellow-400" />
          Community Leaderboard
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          See how your Eco-Score and personal behavior impact compares to the rest of the community! Earn points by logging your daily habits.
        </p>
      </div>

      {/* Gamification Explanation Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-12 border-l-4 border-l-cyan-400"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          How Points & Levels Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h3 className="font-semibold text-white mb-2">Earning Points</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li><span className="text-green-400 font-medium">+10 Points:</span> For every daily environmental analysis you complete.</li>
              <li><span className="text-yellow-400 font-medium">+100 Points:</span> For every correct answer in the Eco-Quiz.</li>
              <li><span className="text-purple-400 font-medium">+500 Points:</span> When an admin approves an article you wrote for the Learning Hub.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Leveling Up</h3>
            <p className="mb-2">Your <strong>Level</strong> is a direct reflection of your dedication to sustainability.</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>You start at Level 1.</li>
              <li>For every <strong>50 points</strong> you earn, you automatically level up!</li>
              <li>Higher levels signify greater environmental awareness and community contribution.</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 sm:p-6 rounded-2xl border ${
              index === 0 ? 'bg-yellow-400/10 border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.2)]'
              : index === 1 ? 'bg-gray-300/10 border-gray-300/50'
              : index === 2 ? 'bg-orange-400/10 border-orange-400/50'
              : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl ${
                index === 0 ? 'bg-yellow-400 text-black'
                : index === 1 ? 'bg-gray-300 text-black'
                : index === 2 ? 'bg-orange-400 text-black'
                : 'bg-white/10 text-white'
              }`}>
                {index === 0 ? <Trophy className="w-5 h-5 sm:w-6 sm:h-6" /> 
                 : index < 3 ? <Medal className="w-5 h-5 sm:w-6 sm:h-6" /> 
                 : `#${index + 1}`}
              </div>
              
              <div>
                <h3 className="font-bold text-lg sm:text-xl">{user.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="px-2 py-0.5 bg-green-400/10 text-green-400 rounded text-xs font-medium border border-green-400/20">
                    Level {user.level}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl sm:text-2xl">
                {user.points} <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs text-gray-500 font-medium">ECO POINTS</span>
            </div>
          </motion.div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found. Be the first to start analyzing!
          </div>
        )}
      </div>
    </div>
  );
}
