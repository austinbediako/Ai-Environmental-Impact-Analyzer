'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisForm } from '@/components/AnalysisForm';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { Recommendations } from '@/components/Recommendations';
import { Loader2, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAnalyze = async (formData: any) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await api.post('/api/analyze', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        window.dispatchEvent(new Event('history-updated'));
        setResult({
          score: response.data.data.footprintScore,
          keyFindings: response.data.data.analysisDetails?.keyFindings || [],
          alternatives: response.data.data.analysisDetails?.alternatives || [],
          pointsEarned: response.data.pointsEarned,
          newTotalPoints: response.data.newTotalPoints
        });
      } else {
        console.error('API Error:', response.data.error);
        setResult({ score: 50, keyFindings: [], alternatives: [] });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }, message?: string };
      console.error('Failed to analyze behavior:', error.response?.data?.error || error.message);
      setResult({ score: 50, keyFindings: [], alternatives: [] });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8 mt-10">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-400/5 rounded-full blur-[100px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {!isAnalyzing && !result && (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full"
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Daily Behavior Analysis</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Submit your daily habits to get an AI-powered evaluation of your personal environmental impact and level up your Eco-Score.
              </p>
            </div>
            <AnalysisForm onSubmit={handleAnalyze} />
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="w-16 h-16 text-green-400 animate-spin relative z-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Analyzing Your Habits...</h3>
              <p className="text-gray-400">Processing electricity, water, and diet metrics through our specialized AI coach.</p>
            </div>
          </motion.div>
        )}

        {result && !isAnalyzing && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Personal Analysis Complete</h2>
              <p className="text-gray-400">Here is your tailored environmental report.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
              <ScoreDisplay score={result.score} />
              
              <div className="flex flex-col gap-4">
                <div className="glass-card p-6">
                  <h4 className="font-semibold text-lg mb-2">Key AI Findings</h4>
                  <ul className="space-y-3 text-sm text-gray-300">
                    {result.keyFindings && result.keyFindings.length > 0 ? (
                      result.keyFindings.map((finding: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${idx % 3 === 0 ? 'bg-green-400' : idx % 3 === 1 ? 'bg-yellow-400' : 'bg-cyan-400'}`} />
                          {finding}
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-2 text-gray-500">Wait, no findings were returned.</li>
                    )}
                  </ul>
                </div>

                {result.pointsEarned && (
                  <div className="glass-card p-6 border-yellow-400/50 bg-yellow-400/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    <div className="flex items-center gap-3 relative z-10">
                      <Award className="w-8 h-8 text-yellow-500" />
                      <div>
                        <h4 className="font-bold text-lg text-yellow-500">+{result.pointsEarned} Eco Points Earned!</h4>
                        <p className="text-sm text-yellow-500/80 font-medium">
                          Total Points: {result.newTotalPoints}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Recommendations alternatives={result.alternatives} />

            <button
              onClick={() => setResult(null)}
              className="mt-12 px-8 py-4 bg-white/5 border border-white/10 rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              Analyze Another Timeline
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
