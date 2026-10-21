'use client';

import { motion } from 'framer-motion';
import { BookOpen, Video, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AuthRequiredModal } from '@/components/AuthRequiredModal';

export default function LearningPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPath, setPendingPath] = useState('');

  const handleCardClick = (e: React.MouseEvent, href: string, type: string) => {
    // Videos are public, Articles and Quiz are private
    if (type === 'Video' || user) {
      return; // Link component handles it normally or navigation is allowed
    }

    // Block navigation and show modal
    e.preventDefault();
    setPendingPath(href);
    setShowAuthModal(true);
  };

  const content = [
    {
      type: "Article",
      title: "Understanding Your Carbon Footprint",
      description: "A deep dive into what makes up your daily CO2 emissions and how small habits can create massive change.",
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      color: "border-blue-400/20 bg-blue-400/5",
      href: "/learning/articles"
    },
    {
      type: "Video",
      title: "The Reality of Fast Fashion",
      description: "Watch how the clothing industry impacts global water supply and learn sustainable shopping alternatives.",
      icon: <Video className="w-6 h-6 text-purple-400" />,
      color: "border-purple-400/20 bg-purple-400/5",
      href: "/learning/video"
    },
    {
      type: "Quiz",
      title: "Test Your Eco-Knowledge",
      description: "Take this 10-question quiz to see how much you really know about energy conservation.",
      icon: <HelpCircle className="w-6 h-6 text-yellow-400" />,
      color: "border-yellow-400/20 bg-yellow-400/5",
      href: "/learning/quiz"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <AuthRequiredModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Awareness & Learning</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Educate yourself through our curated articles, watch insightful videos, and challenge your understanding with climate quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item, index) => (
          <Link 
            href={item.href} 
            key={index}
            onClick={(e) => handleCardClick(e, item.href, item.type)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`h-full rounded-2xl p-6 border transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg ${item.color} hover:bg-white/5 flex flex-col`}
            >
              <div className="mb-4">
                <span className="inline-flex items-center justify-center p-3 rounded-xl bg-white/5 shadow-sm">
                  {item.icon}
                </span>
              </div>
              
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {item.type}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                {item.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                {item.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-medium text-white/70 group-hover:text-white transition-colors mt-auto pt-4 border-t border-white/10">
                 Start {item.type} <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <div className="inline-block p-6 rounded-2xl border border-white/10 bg-white/5">
          <h3 className="text-lg font-bold mb-2">Admin Notice</h3>
          <p className="text-sm text-gray-400">
            More content is regularly updated by the platform administrators. Check back weekly for new quizzes and articles!
          </p>
        </div>
      </div>
    </div>
  );
}
