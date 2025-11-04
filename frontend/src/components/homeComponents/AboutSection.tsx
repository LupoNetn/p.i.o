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
        {/* Left - Intersecting Images */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full lg:w-1/2 flex justify-center"
        >
          <div className="relative w-[280px] sm:w-[420px] md:w-[480px] h-[380px]">
            {/* First image (foreground) */}
            <motion.img
              src="/pio-img3.jpg"
              alt="Producer working in studio"
              className="absolute top-0 left-0 w-[90%] h-[80%] object-cover rounded-2xl 
                         border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.1)]
                         rotate-[-4deg] translate-x-[-30px] translate-y-[30px]
                         transition-all duration-700 hover:rotate-[-2deg] hover:scale-[1.02]"
            />

            {/* Second image */}
            <motion.img
              src="/pio-img1.jpg"
              alt="Producer portrait close-up"
              className="absolute bottom-0 right-0 w-[80%] h-[80%] object-cover rounded-2xl 
                         border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.15)]
                         rotate-[5deg] translate-x-[30px] translate-y-[-20px]
                         transition-all duration-700 hover:rotate-[3deg] hover:scale-[1.03]"
            />

            {/* Glow ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-color-accent/30 to-color-highlight/20 blur-3xl opacity-40 rounded-3xl" />
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

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
            I’m <span className="text-color-accent font-semibold">P.I.O</span>
            <span> official</span> — a producer obsessed with creating sounds
            that move people. Each beat tells a story — raw, emotional, and
            unforgettable.
          </p>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
            My craft blends{" "}
            <span className="text-color-highlight">AfroTrap</span>,{" "}
            <span className="text-color-highlight">Drill</span>, and soulful
            energy — mixing heart with rhythm to build timeless soundscapes that
            inspire every listener.
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
