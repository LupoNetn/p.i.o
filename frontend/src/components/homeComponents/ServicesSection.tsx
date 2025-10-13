import React from "react";
import { Music, Sliders, AudioLines, Mic2 } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: <Music size={32} />,
    title: "Beat Production",
    description:
      "Custom instrumentals tailored to your sound — from Afrobeat to Trap. Every beat hits with emotion, rhythm, and fire.",
  },
  {
    icon: <Sliders size={32} />,
    title: "Mixing & Mastering",
    description:
      "Get industry-grade clarity and balance that make your tracks shine across all streaming platforms.",
  },
  {
    icon: <AudioLines size={32} />,
    title: "Sound Design & Arrangement",
    description:
      "Unique melodies, textures, and transitions that elevate your song’s emotion and energy.",
  },
  {
    icon: <Mic2 size={32} />,
    title: "Artist Development",
    description:
      "Personal sessions that help you refine your tone, delivery, and creative direction for every project.",
  },
];

const ServicesSection = () => {
  return (
    <section className="text-text-primary text-center mb-12">
      <div className="max-w-6xl mb-12 app-container mx-auto">
        <h2 className="text-2xl md:text-4xl font-heading font-bold mb-4">
          What I Bring to Your Sound
        </h2>
        <p className="text-text-muted font-body text-base md:text-lg">
          Every artist deserves a sound that speaks louder than words.
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-hidden relative">
        <motion.div
          className="flex gap-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 10,
            ease: "linear",
          }}
        >
          {/* Duplicate items for seamless loop */}
          {[...services, ...services].map((service, index) => (
            <div
              key={index}
              className="min-w-[250px] md:min-w-[300px] bg-background border border-color-border rounded-2xl p-6 flex flex-col  space-y-4 hover:shadow-[0_0_20px_rgba(138,43,226,0.6)] transition-shadow duration-300"
            >
              <div className="text-color-accent">{service.icon}</div>
              <h3 className="font-heading text-lg md:text-xl font-semibold">
                {service.title}
              </h3>
              <p className="text-text-muted text-sm md:text-base font-body leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
