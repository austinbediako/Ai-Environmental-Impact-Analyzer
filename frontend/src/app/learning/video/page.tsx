'use client';

import { motion } from 'framer-motion';
import { Video, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VideosPage() {
  const videos = [
    {
      title: "Our Planet | Forests | FULL EPISODE | Netflix",
      src: "https://www.youtube.com/embed/JkaxUblCGz0",
      description: "Experience the fragility of Earth's forests and the crucial role they play in the survival of life on our planet."
    },
    {
      title: "How to reduce your carbon footprint",
      src: "https://www.youtube.com/embed/KdiA12KeSL0",
      description: "Simple, highly effective daily strategies to cut down your emissions."
    },
    {
      title: "The diet that helps fight climate change",
      src: "https://www.youtube.com/embed/nUnJQWO4YJY",
      description: "How shifting food dependencies can structurally cool down global agricultural carbon streams."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <Link href="/learning" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
      </Link>
      
      <div className="flex items-center gap-3 mb-10">
        <Video className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold">Climate Documentaries</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {videos.map((vid, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-card p-4 overflow-hidden"
          >
            <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black mb-4">
              <iframe
                src={vid.src}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h3 className="text-xl font-bold mb-2">{vid.title}</h3>
            <p className="text-gray-400 text-sm">{vid.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
