'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Award, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AuthRequiredModal } from '@/components/AuthRequiredModal';

interface QuizQuestion {
  _id: string; // fallback questions use 'fallback-1' etc
  question: string;
  options: string[];
  pointsAwarded: number;
}

const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    _id: 'fb-1',
    question: "What is the most common greenhouse gas emitted by human activities?",
    options: ["Methane", "Carbon Dioxide (CO2)", "Nitrous Oxide", "Ozone"],
    pointsAwarded: 10
  },
  {
    _id: 'fb-2',
    question: "Which of the following is considered a renewable energy source?",
    options: ["Coal", "Natural Gas", "Solar", "Nuclear"],
    pointsAwarded: 10
  },
  {
    _id: 'fb-3',
    question: "What percentage of the Earth's water is accessible, fresh drinking water?",
    options: ["1%", "15%", "50%", "72%"],
    pointsAwarded: 10
  },
  {
    _id: 'fb-4',
    question: "Which animal is most critically affected by the melting of Arctic sea ice?",
    options: ["Elephant", "Polar Bear", "Penguin", "Panda"],
    pointsAwarded: 10
  },
  {
    _id: 'fb-5',
    question: "What is the primary cause of ocean acidification?",
    options: ["Plastic pollution", "Oil spills", "Absorption of CO2 from the atmosphere", "Overfishing"],
    pointsAwarded: 10
  },
  {
    _id: 'fb-6',
    question: "Which forest is often referred to as the 'Lungs of the Earth'?",
    options: ["Amazon Rainforest", "Black Forest", "Taiga", "Congo Basin"],
    pointsAwarded: 10
  },
  {
    _id: 'fb-7',
    question: "Approximately how long does it take for a plastic bottle to decompose?",
    options: ["50 years", "100 years", "450 years", "Never"],
    pointsAwarded: 10
  },
  {
    _id: 'fb-8',
    question: "Which greenhouse gas is primarily released from landfills and livestock?",
    options: ["Oxygen", "Argon", "Methane", "Helium"],
    pointsAwarded: 10
  },
  {
    _id: 'fb-9',
    question: "What is the main objective of a 'Zero Waste' lifestyle?",
    options: ["Burning all trash", "Sending nothing to landfills or oceans", "Recycling only glass", "Using more electricity"],
    pointsAwarded: 10
  },
  {
    _id: 'fb-10',
    question: "What is the process of recycling organic matter like food scraps into fertilizer called?",
    options: ["Incineration", "Composting", "Landfilling", "Distillation"],
    pointsAwarded: 10
  }
];

// Fallback correct answers evaluated LOCALLY if API drops
const FALLBACK_ANSWERS: Record<string, number> = {
  'fb-1': 1,
  'fb-2': 2,
  'fb-3': 0,
  'fb-4': 1,
  'fb-5': 2,
  'fb-6': 0,
  'fb-7': 2,
  'fb-8': 2,
  'fb-9': 1,
  'fb-10': 1
};

export default function QuizPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{ totalPointsAwarded: number, feedback: any[] } | null>(null);

  useEffect(() => {
    if (token) {
      api.get('/api/learning/quiz', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data.data.length > 0) {
          setQuestions(res.data.data);
        } else {
          setQuestions(FALLBACK_QUESTIONS);
        }
      })
      .catch(err => {
        console.error("Quiz API failed, using fallback.", err);
        setQuestions(FALLBACK_QUESTIONS);
      })
      .finally(() => setLoading(false));
    }
  }, [token]);

  const handleSelectOption = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentIdx]._id]: optIdx }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    // If we are using fallback, evaluate locally
    if (questions === FALLBACK_QUESTIONS) {
      let pts = 0;
      const fb = [];
      for (const q of questions) {
        const correctIdx = FALLBACK_ANSWERS[q._id];
        const isCorrect = answers[q._id] === correctIdx;
        if (isCorrect) pts += q.pointsAwarded;
        fb.push({ questionId: q._id, isCorrect, correctAnswerIndex: correctIdx, explanation: 'Local fallback quiz.' });
      }
      setResults({ totalPointsAwarded: pts, feedback: fb });
      setIsSubmitted(true);
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post('/api/learning/quiz', { answers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data.data);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <AuthRequiredModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          title="Eco-Knowledge is for Members"
          message="Join the mission to save the planet! Sign in to take our climate quizzes, earn Eco Points, and climb the global leaderboard."
        />
        <div className="p-10 glass-card max-w-md">
          <HelpCircle className="w-16 h-16 text-yellow-400/50 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Quiz Locked</h2>
          <p className="text-gray-400 mb-8">You need an account to track your progress and earn points from quizzes.</p>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20"
          >
            Log In to Play
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (isSubmitted && results) {
    const isPerfect = results.feedback.every(f => f.isCorrect);
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-8 max-w-lg w-full text-center">
          <Award className={`w-16 h-16 mx-auto mb-4 ${isPerfect ? 'text-yellow-400' : 'text-blue-400'}`} />
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-xl text-gray-300 mb-6">
            You scored <strong className="text-white">{results.feedback.filter(f=>f.isCorrect).length}</strong> out of {questions.length}.
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-1">+{results.totalPointsAwarded}</h3>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Eco Points Awarded</p>
          </div>

          <Link href="/learning" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-bold text-white">
            Return to Learning Hub
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answeredCurrent = answers[currentQ._id] !== undefined;
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <Link href="/learning" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
      </Link>
      
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400 flex items-center gap-2"><HelpCircle className="w-6 h-6" /> Eco Knowledge</h1>
        <span className="text-sm font-bold text-gray-400">Question {currentIdx + 1} of {questions.length}</span>
      </div>

      <div className="w-full bg-white/5 h-2 rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="h-full bg-yellow-400" 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ._id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-6 md:p-10 mb-8"
        >
          <h2 className="text-2xl font-bold mb-8 leading-relaxed">{currentQ.question}</h2>
          
          <div className="space-y-4">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all ${
                  answers[currentQ._id] === i 
                    ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-100' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                }`}
              >
                <div className="flex gap-4">
                  <span className={`font-bold ${answers[currentQ._id] === i ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        {currentIdx < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!answeredCurrent}
            className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-xl disabled:opacity-30 transition-all hover:bg-yellow-300"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!answeredCurrent || submitting}
            className="px-8 py-3 bg-green-400 text-black font-bold rounded-xl disabled:opacity-30 transition-all hover:bg-green-300 flex items-center gap-2"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalize & Score'}
          </button>
        )}
      </div>

    </div>
  );
}
