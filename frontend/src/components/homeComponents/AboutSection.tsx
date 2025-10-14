"use client";
import { motion } from "framer-motion";
import { Sparkles, Music2, Headphones } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="relative py-24 overflow-hidden font-audio">
      {/* Background visuals */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/95" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_70%)]" />
      <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-color-accent/10 blur-3xl rounded-full animate-pulse" />

      {/* Content */}
      <div className="relative app-container flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full lg:w-1/2 flex justify-center"
        >
          <div className="relative group">
            <img
              src="/images/producer-portrait.jpg"
              alt="Producer portrait"
              className="rounded-2xl w-[320px] sm:w-[400px] md:w-[450px] 
                         border border-white/10 object-cover shadow-[0_0_60px_rgba(255,255,255,0.05)] 
                         group-hover:scale-[1.03] transition-all duration-500"
            />
            {/* glowing ring */}
            <div className="absolute -inset-2 bg-gradient-to-r from-color-accent/50 to-color-highlight/30 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500" />
          </div>
        </motion.div>

        {/* Right - Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative z-10 w-full lg:w-1/2"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-3 flex items-center gap-2">
            <Sparkles className="text-color-accent" size={30} />
            About Me
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
            I’m <span className="text-color-accent font-semibold">P.I.O</span> — a passionate music producer 
            who lives for rhythm, soul, and storytelling through sound.  
            I turn raw ideas into timeless beats, blending energy and emotion in every project.
          </p>

          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
            From late-night sessions to sunrise inspiration, my sound travels across genres — 
            from the heart of <span className="text-color-highlight font-semibold">AfroTrap</span> to the edge of <span className="text-color-highlight font-semibold">Drill</span> and beyond.  
            Each production is a journey — one that connects creativity, mood, and pure vibe.
          </p>

          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="p-4 bg-white/10 rounded-full text-color-accent"
            >
              <Music2 size={28} />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, rotate: -10 }}
              className="p-4 bg-white/10 rounded-full text-color-accent"
            >
              <Headphones size={28} />
            </motion.div>
          </div>

          {/* Accent line */}
          <div className="mt-10 h-[3px] w-24 bg-gradient-to-r from-color-accent to-color-highlight rounded-full animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
