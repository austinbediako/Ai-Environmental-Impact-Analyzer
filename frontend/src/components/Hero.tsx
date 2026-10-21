'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf, Cpu, Zap, BookOpen, Trophy } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-hero-gradient opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20 mb-8 backdrop-blur-md"
        >
          <span className="flex w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-bold text-green-400">Powered by Google Gemini Pro AI</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
        >
          Analyze the <span className="text-gradient">True Impact</span> of Your Choices
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
        >
          Harness the analytical precision of advanced AI to decode the environmental cost of your lifestyle.
          Gain clarity, share knowledge, and join a community dedicated to a greener future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/analyze"
            className="group relative px-8 py-4 bg-green-400 text-black font-semibold rounded-full overflow-hidden flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">Start Analysis</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="#features"
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full"
        >
          {[
            {
              icon: <Cpu className="w-6 h-6 text-green-400" />,
              title: "AI Analysis",
              desc: "Deep behavioral and material analysis via Google Gemini"
            },
            {
              icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
              title: "Community Insights",
              desc: "Read and contribute to our growing library of eco-articles"
            },
            {
              icon: <Trophy className="w-6 h-6 text-yellow-400" />,
              title: "Eco Challenges",
              desc: "Test your knowledge and climb the global leaderboard"
            }
          ].map((feature, idx) => (
            <div key={idx} className="glass-card p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all cursor-default">
              <div className="p-3 bg-white/5 rounded-2xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
