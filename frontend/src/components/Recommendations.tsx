'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';

interface Alternative {
  title: string;
  desc: string;
}

export function Recommendations({ alternatives = [] }: { alternatives?: Alternative[] }) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Eco-Friendly Lifestyle Alternatives
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alternatives.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="glass-card p-5 group cursor-pointer"
          >
            <div className={`p-3 rounded-lg w-fit mb-4 bg-green-400/10 text-green-400`}>
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-lg mb-2 text-gray-200">{item.title}</h4>
            <p className="text-sm text-gray-400 mb-4">{item.desc}</p>
            
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(item.title + " sustainable tips")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-white/50 group-hover:text-white transition-colors"
            >
              Explore Change <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
