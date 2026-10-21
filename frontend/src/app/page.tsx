'use client';

import { Hero } from "@/components/Hero";
import { motion } from "framer-motion";
import { 
  Cpu, BookOpen, Trophy, ArrowRight, ShieldCheck, 
  Users, Sparkles, Target, Zap 
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col w-full text-white bg-black">
      <Hero />
      
      {/* Precision Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20 mb-6">
                <Cpu className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-green-400">Advanced Intelligence</span>
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Deciphering Data with <span className="text-gradient">AI Precision</span>
              </motion.h2>
              <motion.p variants={itemVariants} className="text-gray-400 text-lg mb-8 leading-relaxed">
                Traditional carbon calculators often rely on static, outdated formulas. Our integration with <strong className="text-white">Google Gemini Pro</strong> allows for real-time analysis of manufacturing complexities, transportation logistics, and behavioral patterns.
              </motion.p>
              
              <motion.div variants={itemVariants} className="space-y-4">
                {[
                  { icon: <Zap className="w-5 h-5" />, title: "Real-time Processing", desc: "Get instant feedback on your choices." },
                  { icon: <Target className="w-5 h-5" />, title: "Adaptive Logic", desc: "The AI learns from global environmental trends." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="shrink-0 p-2 bg-green-400/10 rounded-lg text-green-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold">{feature.title}</h4>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            
            <motion.div 
              variants={itemVariants}
              className="relative aspect-square glass-card p-1 overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10" />
               <div className="relative h-full w-full bg-zinc-950 rounded-[inherit] overflow-hidden flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border border-white/5 rounded-full flex items-center justify-center animate-spin-slow">
                     <div className="w-2/3 h-2/3 border border-green-400/20 rounded-full flex items-center justify-center">
                        <Cpu className="w-20 h-20 text-green-400 animate-pulse" />
                     </div>
                  </div>
                  {/* Floating particles */}
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full blur-[2px]" />
                  <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full blur-[3px]" />
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
           <div className="max-w-3xl mx-auto text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-6"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Crowdsourced Wisdom</span>
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">A Knowledge-Driven <span className="text-gradient">Community</span></h2>
              <p className="text-gray-400 text-lg">Don't just track your impact—expand it. Read peer-reviewed articles on environmental science or contribute your own research to educate others.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Read Articles", desc: "Scientific insights on carbon reduction.", link: "/learning/articles", color: "from-blue-500" },
                { title: "Write & Share", desc: "Contribute to the global eco-library.", link: "/learning/articles", color: "from-green-500" },
                { title: "Moderate Content", desc: "Maintain standards as a dedicated member.", link: "/admin", color: "from-purple-500" }
              ].map((card, i) => (
                <Link key={i} href={card.link}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group glass-card p-8 hover:bg-white/10 transition-all text-center relative overflow-hidden h-full"
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.color} to-transparent opacity-50`} />
                    <BookOpen className="w-10 h-10 mx-auto mb-6 text-gray-400 group-hover:text-white transition-colors" />
                    <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                    <p className="text-sm text-gray-500 mb-6">{card.desc}</p>
                    <div className="flex items-center justify-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                       Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6">
           <div className="glass-card p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 border border-green-400/20">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">Eco-Quiz: Challenge <span className="text-gradient">The Norm</span></h2>
                <p className="text-gray-400 text-lg mb-8">Test your knowledge against 10 scientific inquiries. Climb the leaderboard, earn badges, and prove your commitment to the planet.</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Link href="/learning/quiz" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2">
                    Take the Quiz <Trophy className="w-5 h-5" />
                  </Link>
                  <Link href="/leaderboard" className="px-8 py-3 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all">
                    View Leaderboard
                  </Link>
                </div>
              </div>
              <div className="shrink-0 p-8 bg-green-500/10 rounded-3xl border border-green-500/20 rotate-3">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-white/5">
                       <span className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-xs font-bold">1</span>
                       <span className="text-sm font-bold">Top Scientist</span>
                       <span className="text-xs text-green-400 ml-auto">+1,200 pts</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-white/5">
                       <span className="w-6 h-6 rounded-full bg-gray-400/20 text-gray-400 flex items-center justify-center text-xs font-bold">2</span>
                       <span className="text-sm font-bold">Eco Warrior</span>
                       <span className="text-xs text-green-400 ml-auto">+950 pts</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Learn More Final CTA */}
      <section className="py-32 container mx-auto px-4 text-center">
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto"
         >
            <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">Everything Connects.</h2>
            <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
              Our mission is to make environmental data high-fidelity and community-accessible.
            </p>
            <Link 
              href="/about"
              className="inline-flex items-center gap-3 text-2xl font-black text-white hover:text-green-400 transition-colors group underline underline-offset-8 decoration-green-400/50"
            >
              Learn More About Our Purpose <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
            </Link>
         </motion.div>
      </section>
    </div>
  );
}
