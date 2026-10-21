'use client';

import { motion } from 'framer-motion';
import { Leaf, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScoreDisplay({ score }: { score: number }) {
  // Determine color based on score (lower is better)
  const isGood = score < 40;
  const isWarning = score >= 40 && score < 70;

  const colorConfig = isGood 
    ? { ring: 'text-green-400', bg: 'bg-green-400/10', glow: 'shadow-[0_0_30px_rgba(74,222,128,0.3)]' }
    : isWarning
      ? { ring: 'text-yellow-400', bg: 'bg-yellow-400/10', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.3)]' }
      : { ring: 'text-red-500', bg: 'bg-red-500/10', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]' };

  // Calculate SVG stroke offset
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("glass-card p-8 flex flex-col items-center justify-center relative", colorConfig.glow)}
    >
      <div className="absolute top-4 right-4">
        {isGood ? <Leaf className="w-6 h-6 text-green-400" /> :
         isWarning ? <Info className="w-6 h-6 text-yellow-400" /> :
         <AlertTriangle className="w-6 h-6 text-red-500" />}
      </div>
      
      <h3 className="text-xl font-bold mb-6 text-gray-200">Environmental Footprint</h3>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90 absolute">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/10"
          />
          {/* Animated score circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={colorConfig.ring}
          />
        </svg>
        
        <div className="flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={cn("text-4xl font-extrabold", colorConfig.ring)}
          >
            {score}
          </motion.span>
          <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-300">
          {isGood ? "Great! This product has a low environmental impact." :
           isWarning ? "Moderate impact. Consider looking for sustainable alternatives." :
           "High impact! We strongly recommend eco-friendly alternatives."}
        </p>
      </div>
    </motion.div>
  );
}
