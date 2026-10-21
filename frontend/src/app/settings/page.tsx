'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, Save, ArrowLeft, Loader2, 
  CheckCircle2, UserCircle, BookOpen, Edit3, Trash2, 
  Clock, AlertCircle, CheckCircle, XCircle, RefreshCw 
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Article {
  _id: string;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  isUpdateRequested: boolean;
  isDeletionRequested: boolean;
  createdAt: string;
}

export default function SettingsPage() {
  const { user, token, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'articles'>('profile');
  
  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Articles State
  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [isEditingArticle, setIsEditingArticle] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (activeTab === 'articles' && token) {
      fetchMyArticles();
    }
  }, [activeTab, token]);

  const fetchMyArticles = async () => {
    setLoadingArticles(true);
    try {
      const res = await api.get('/api/learning/my-articles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyArticles(res.data.data);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleRequestDeletion = async (id: string) => {
    if (!confirm("Are you sure you want to request deletion of this article? Admin approval is required.")) return;
    try {
      await api.post(`/api/learning/articles/${id}/request-deletion`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyArticles();
    } catch (err) {
      console.error('Failed to request deletion', err);
    }
  };

  const handleRequestUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingArticle) return;
    try {
      await api.post(`/api/learning/articles/${isEditingArticle}/request-update`, {
        title: editTitle,
        content: editContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditingArticle(null);
      fetchMyArticles();
      alert("Update request submitted for admin review.");
    } catch (err) {
      console.error('Failed to request update', err);
    }
  };

  const handleCancelDeletion = async (id: string) => {
    try {
      await api.post(`/api/learning/articles/${id}/cancel-deletion`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyArticles();
    } catch (err) {
      console.error('Failed to cancel deletion request', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const res = await api.put('/api/auth/profile', { name, password }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local auth state if backend returns new user data/token
      if (res.data) {
        // Here we just re-sync the session by using the new token/data if provided
        // Our AuthContext 'login' method usually handles this
        login(res.data, res.data.token); 
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setPassword(''); // Clear password field after success
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Please log in to access settings</h1>
        <Link href="/login" className="px-6 py-3 bg-green-400 text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-400/20">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
          <User className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-400">Manage your profile and security preferences</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mb-8 max-w-md">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'profile' ? 'bg-green-400 text-black shadow-lg shadow-green-400/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserCircle className="w-4 h-4" /> Personal Profile
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'articles' ? 'bg-green-400 text-black shadow-lg shadow-green-400/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4" /> My Published Articles
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Profile Summary Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6 text-center"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-500/20 to-teal-500/20 border-2 border-white/10 flex items-center justify-center">
                    <UserCircle className="w-16 h-16 text-green-300" />
                  </div>
                  <div className="absolute bottom-0 right-0 p-1.5 bg-green-500 rounded-full border-4 border-zinc-950">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold truncate">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-green-400">
                  {user.role} Account
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Activity Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Eco Points</span>
                    <span className="font-bold text-green-400">{(user as any).points || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Badges Earned</span>
                    <span className="font-bold text-white">{(user as any).badges?.length || 0}</span>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500">Member since {new Date((user as any).createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Edit Profile Form */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
              >
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
                          setName(val);
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-400/50 transition-colors"
                        placeholder="Your Full Name"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 ml-1 italic font-medium">
                      * Name should be alphabets only
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-2 text-[10px] text-gray-600 px-1">Email cannot be changed for security reasons.</p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Update Password</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-400/50 transition-colors"
                        placeholder="Enter new password (leave blank to keep current)"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 ml-1 italic font-medium">
                      * Leave blank to keep current password
                    </p>
                  </div>

                  {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
                      message.type === 'success' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'
                    }`}>
                      {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                      {message.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-8 py-3 bg-green-400 text-black font-extrabold rounded-xl transition-all hover:bg-[#00e65c] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Settings
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {loadingArticles ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                <Loader2 className="w-10 h-10 text-green-400 animate-spin mb-4" />
                <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Fetching your contributions...</p>
              </div>
            ) : myArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed text-center px-4">
                <div className="p-4 bg-white/5 rounded-full mb-6">
                  <BookOpen className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
                <p className="text-gray-400 max-w-sm mb-8">You haven't published any articles yet. Share your environmental insights with the community!</p>
                <Link href="/learning/articles" className="px-6 py-3 bg-green-400 text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-400/20">
                   Start Writing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myArticles.map((article) => (
                  <motion.div 
                    key={article._id}
                    className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                         <h3 className="text-xl font-bold text-white truncate">{article.title}</h3>
                         <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                           article.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                           article.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                           'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                         }`}>
                           {article.status}
                         </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                        {article.isUpdateRequested && (
                          <span className="flex items-center gap-1.5 text-yellow-500"><AlertCircle className="w-3 h-3" /> Update Pending</span>
                        )}
                        {article.isDeletionRequested && (
                          <span className="flex items-center gap-1.5 text-orange-500"><AlertCircle className="w-3 h-3" /> Deletion Requested</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                       <button 
                         onClick={() => {
                           setIsEditingArticle(article._id);
                           setEditTitle(article.title);
                           setEditContent(article.content);
                         }}
                         disabled={article.isDeletionRequested}
                         className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
                       >
                         <Edit3 className="w-4 h-4" /> Request Edit
                       </button>

                       {article.isDeletionRequested ? (
                         <button 
                           onClick={() => handleCancelDeletion(article._id)}
                           className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-sm font-bold hover:bg-orange-500/20 transition-all text-orange-400"
                         >
                           <RefreshCw className="w-4 h-4" /> Undo Request
                         </button>
                       ) : (
                         <button 
                           onClick={() => handleRequestDeletion(article._id)}
                           className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all text-red-400"
                         >
                           <Trash2 className="w-4 h-4" /> Delete
                         </button>
                       )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal (Portal-like) */}
      <AnimatePresence>
        {isEditingArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsEditingArticle(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
             >
                <div className="p-8">
                   <h2 className="text-2xl font-bold mb-6">Request Article Update</h2>
                   <form onSubmit={handleRequestUpdate} className="space-y-6">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Revised Title</label>
                        <input 
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-400/50 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Revised Content</label>
                        <textarea 
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          rows={8}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-400/50 outline-none transition-all resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                         <button 
                           type="submit"
                           className="flex-1 py-3 bg-green-400 text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                         >
                           Submit Update Request
                         </button>
                         <button 
                           type="button"
                           onClick={() => setIsEditingArticle(null)}
                           className="px-6 py-3 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all text-gray-300"
                         >
                           Cancel
                         </button>
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
