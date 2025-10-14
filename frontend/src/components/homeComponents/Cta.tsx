"use client";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";

const Cta = () => {
  return (
    <section className="relative overflow-hidden font-audio">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />

      {/* Animated floating glow */}
      <div className="absolute top-[20%] left-[30%] w-[200px] h-[200px] bg-color-accent/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-[10%] right-[25%] w-[180px] h-[180px] bg-color-highlight/10 blur-3xl rounded-full animate-pulse" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 app-container text-center text-white flex flex-col items-center gap-8"
      >
        {/* Heading */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-color-accent via-color-highlight to-color-accent bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">
          Let’s Make Magic Together
        </h2>

        {/* Subtext */}
        <p className="text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed">
          Your sound deserves the best — whether it’s a hard-hitting beat, smooth mix, or full production session.  
          Let’s turn your vision into something unforgettable.
        </p>

        {/* CTA Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="mt-4 px-8 py-4 text-lg bg-color-accent text-color-text-primary hover:bg-color-highlight 
                       transition-all duration-300 flex items-center gap-3 font-bold tracking-wide shadow-lg shadow-color-accent/20"
          >
            <PlayCircle size={22} />
            <span>Book Your Session Now</span>
          </Button>
        </motion.div>

        {/* Accent Line */}
        <div className="mt-10 w-48 h-[3px] bg-gradient-to-r from-color-accent to-color-highlight rounded-full animate-pulse"></div>
      </motion.div>

      {/* Subtle bottom wave effect */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent blur-md"></div>
    </section>
  );
};

export default Cta;
