import { motion } from "framer-motion";
import { Music2, SlidersHorizontal, Waves, Mic2 } from "lucide-react";

const services = [
  {
    id: 1,
    icon: <Music2 size={38} />,
    title: "Music Production",
    desc: "Full-scale beat creation tailored to your style — trap, afrobeats, drill, or soul.",
  },
  {
    id: 2,
    icon: <SlidersHorizontal size={38} />,
    title: "Mixing & Mastering",
    desc: "Crisp, balanced, and professional sound engineering that makes your tracks radio-ready.",
  },
  {
    id: 3,
    icon: <Waves size={38} />,
    title: "Sound Design",
    desc: "Crafting unique sound textures that define your signature sonic identity.",
  },
  {
    id: 4,
    icon: <Mic2 size={38} />,
    title: "Recording Sessions",
    desc: "Studio-grade vocal recording sessions to bring your ideas to life with perfection.",
  },
];

const ServicesSection = () => {
  return (
    <section className="relative py-24 overflow-hidden font-audio">
      {/* background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/95" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_60%)]" />

      {/* content */}
      <div className="relative app-container text-left">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-3 relative inline-block">
            Services
            <span className="absolute left-0 -bottom-2 w-16 h-[3px] bg-gradient-to-r from-color-accent to-color-highlight rounded-full animate-pulse" />
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            What I have to offer to your sound!
          </p>
        </motion.div>

        {/* service cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="group relative p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md 
              hover:bg-white/10 hover:border-color-accent/60 transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.08)]"
            >
              <div className="text-color-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {service.desc}
              </p>

              {/* glowing underline on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-color-accent to-color-highlight rounded-full group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* background glow circle */}
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-color-accent/10 blur-3xl rounded-full animate-pulse" />
    </section>
  );
};

export default ServicesSection;
