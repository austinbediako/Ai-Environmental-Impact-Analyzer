'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, PenTool, Loader2, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { AuthRequiredModal } from '@/components/AuthRequiredModal';

interface Article {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export default function ArticlesPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(true); // Always true if accessed unauthorized
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isComposing, setIsComposing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (token) {
      api.get('/api/learning/articles', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setArticles(res.data.data))
      .catch(err => console.error("Failed to fetch articles", err))
      .finally(() => setLoading(false));
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitStatus('submitting');
    
    try {
      await api.post('/api/learning/articles', { title: newTitle, content: newContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitStatus('success');
      setNewTitle('');
      setNewContent('');
      setTimeout(() => { setIsComposing(false); setSubmitStatus('idle'); }, 2000);
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <AuthRequiredModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          title="Articles are Member-Only"
          message="Deep dive into our expert-led environmental articles by joining the EcoAnalyzer community. Log in or create an account to unlock all educational content!"
        />
        <div className="p-10 glass-card max-w-md">
          <BookOpen className="w-16 h-16 text-blue-400/50 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Account Required</h2>
          <p className="text-gray-400 mb-8">Please sign in to read community articles and environmental insights.</p>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
          >
            Access Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/learning" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Community Articles</h1>
        </div>
        <button 
          onClick={() => setIsComposing(!isComposing)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-xl hover:bg-blue-500/30 transition-colors"
        >
          <PenTool className="w-4 h-4" />
          {isComposing ? 'Cancel Composition' : 'Write an Article'}
        </button>
      </div>

      {isComposing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-12">
          <form onSubmit={handleSubmit} className="glass-card p-6 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <h3 className="text-xl font-bold mb-4">Submit to Community</h3>
            <p className="text-sm text-gray-400 mb-6">Your article will be reviewed by platform administrators before being published publicly.</p>
            
            <input 
              required
              type="text" 
              placeholder="Article Title" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-blue-500/50"
            />
            <textarea 
              required
              placeholder="Write your environmental insights here..." 
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-48 bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-blue-500/50 resize-y"
            />
            
            <div className="flex items-center gap-4">
              <button 
                type="submit" 
                disabled={submitStatus === 'submitting'}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 disabled:opacity-50"
              >
                {submitStatus === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit for Review'}
              </button>
              {submitStatus === 'success' && <span className="text-green-400 font-medium">Submitted successfully!</span>}
              {submitStatus === 'error' && <span className="text-red-400 font-medium">Error submitting article.</span>}
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-400 animate-spin" /></div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <p className="text-gray-400">No approved articles yet. Be the first to write one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <motion.div key={article._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
              <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                By <strong className="text-gray-300">{article.authorName}</strong> • {new Date(article.createdAt).toLocaleDateString()}
              </div>
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
