"use client";

import { Card } from "../components/ui/card";
import { BEATS } from "../constants/constants";
import { Music2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const Beats = () => {
  return (
    <section className="font-heading app-container pt-16 mt-20 flex flex-col items-center min-h-screen">
      {/* Header */}
      <div className="text-left mb-10 w-full">
        <h2 className="text-4xl font-bold mb-2 text-white">
          Invest in your artistry
        </h2>
        <p className="text-gray-400 text-sm sm:w-[70%]">
          Invest in your sound now. Own your vibe. Buy that beat — and let the
          world hear what you’re made of!
        </p>
      </div>

      {/* Beats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {BEATS.map((beat, index) => (
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-md hover:shadow-color-accent/30 hover:scale-[1.02] transition-all duration-500">
              {/* Image */}
              <div className="relative">
                <img
                  src={beat.cover}
                  alt={beat.title}
                  className="w-full h-44 object-cover rounded-t-2xl"
                />
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 truncate">
                  {beat.title}
                </h3>
                <p className="text-gray-400 text-xs mb-2">{beat.genre}</p>

                <div className="flex items-center justify-between text-sm mb-3">
                  <p className="text-color-accent font-bold">
                    ₦{beat.price.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {beat.bpm} BPM • {beat.key}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-white/10 bg-white/10 text-color-accent hover:bg-color-accent hover:text-black text-sm transition-all"
                  >
                    <Music2 size={16} /> Preview
                  </motion.button>
                   <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-white/10 bg-white/10 text-color-accent hover:bg-color-accent hover:text-black text-sm transition-all"
                  >
                    <ShoppingBag size={16} /> Buy
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Beats;
