'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Droplets, Trash2, Car, Utensils, Sparkles, Fuel, CupSoda, Info } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AnalysisForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    electricityUsage: '',
    waterUsage: '',
    wasteGeneration: '',
    travelDistance: '',
    travelMode: 'Car',
    dietType: 'High Meat',
    fuelUsage: '',
    liquidConsumption: '',
    vehicleType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8 w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-cyan-400/10 text-cyan-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Personal Daily Behavior</h2>
          <p className="text-sm text-gray-400">Log your habits for AI impact analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Electricity Usage (kWh)
            </label>
            <input
              required
              type="number"
              min="0"
              placeholder="e.g. 150"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/50 transition-all"
              value={formData.electricityUsage}
              onChange={(e) => setFormData({ ...formData, electricityUsage: e.target.value })}
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Water Usage (Liters)
            </label>
            <input
              required
              type="number"
              min="0"
              placeholder="e.g. 300"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/50 transition-all"
              value={formData.waterUsage}
              onChange={(e) => setFormData({ ...formData, waterUsage: e.target.value })}
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              Waste Generated (kg)
            </label>
            <input
              required
              type="number"
              min="0"
              placeholder="e.g. 15"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/50 transition-all"
              value={formData.wasteGeneration}
              onChange={(e) => setFormData({ ...formData, wasteGeneration: e.target.value })}
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Car className="w-4 h-4 text-purple-400" />
              Travel Distance (km)
            </label>
            <input
              required
              type="number"
              min="0"
              placeholder="e.g. 50"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/50 transition-all"
              value={formData.travelDistance}
              onChange={(e) => setFormData({ ...formData, travelDistance: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Car className="w-4 h-4 text-purple-400" />
              Travel Mode
            </label>
            <select
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400/50 focus:ring-1 transition-all"
              value={formData.travelMode}
              onChange={(e) => setFormData({ ...formData, travelMode: e.target.value })}
            >
              <option value="Car">Car</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Bike">Motorbike</option>
              <option value="Walk">Walking / Bicycle</option>
            </select>
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Utensils className="w-4 h-4 text-orange-400" />
              Diet Type
            </label>
            <select
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400/50 focus:ring-1 transition-all"
              value={formData.dietType}
              onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
            >
              <option value="High Meat">High Meat</option>
              <option value="Low Meat">Low Meat</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
        </div>

        {/* Multi-Factor Optional Section */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Advanced Multi-Factor Details <span className="text-sm font-normal text-gray-500">(Optional)</span></h3>
          </div>
          <p className="text-xs text-gray-400 mb-6">Providing these details allows our AI to generate a highly precise footprint score.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300 mb-2">
                <Fuel className="w-4 h-4 text-red-400" />
                Direct Fuel Usage (Liters)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 40"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 transition-all"
                value={formData.fuelUsage}
                onChange={(e) => setFormData({ ...formData, fuelUsage: e.target.value })}
              />
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300 mb-2">
                <Car className="w-4 h-4 text-cyan-400" />
                Vehicle Type
              </label>
              <select
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400/50 focus:ring-1 transition-all"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              >
                <option value="">Select Type...</option>
                <option value="Electric">Electric Vehicle (EV)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Fuel">Gas/Diesel</option>
              </select>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300 mb-2">
                <CupSoda className="w-4 h-4 text-blue-400" />
                Primary Liquid Consumed
              </label>
              <select
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400/50 focus:ring-1 transition-all"
                value={formData.liquidConsumption}
                onChange={(e) => setFormData({ ...formData, liquidConsumption: e.target.value })}
              >
                <option value="">Select Primary Liquid...</option>
                <option value="Tap Water">Tap Water</option>
                <option value="Bottled Water">Bottled Water</option>
                <option value="Sugary Drinks/Soda">Sugary Drinks/Soda</option>
                <option value="Alcohol">Alcohol/Spirits</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-4 bg-green-400 text-black font-bold rounded-xl hover:bg-[#00e65c] hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all active:scale-[0.98]"
        >
          Analyze My Behavior
        </button>
      </form>
    </motion.div>
  );
}
